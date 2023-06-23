import json
from flask import Flask, request
import pandas as pd
import json
import numpy as np
from flask_cors import CORS
from datetime import datetime, timedelta
import psycopg2
from scipy import stats
import ast
from operator import itemgetter


app = Flask(__name__)
CORS(app)

conn = psycopg2.connect(database="myApp", user = "postgres", password = "amghezi", host = "127.0.0.1", port = "5432")

def get_week(x):
     return x.isocalendar().week

def datetime_converter(date):
    """
    	Converts the date.

        Args:
            date: date that we want to convert.

        Returns:
            result: converted date.
    """
    month2num = {
        'Jan':'01',
        'Feb':'02',
        'Mar':'03',
        'Apr':'04',
        'May':'05',
        'Jun':'06',
        'Jul':'07',
        'Aug':'08',
        'Sep':'09',
        'Oct':'10',
        'Nov':'11',
        'Dec':'12'
    }
    date = str(date)
    date = date.split()
    result = '-'.join([date[3], month2num[date[1]], date[2]])
    return result


@app.route('/retention', methods=["POST", "GET"])
def summary_data():
    start_date = datetime.fromisoformat(
        datetime_converter(
        request.args.get('startdate', type=str))).timestamp() * 1000000

    end_date = datetime.fromisoformat(
        datetime_converter(
        request.args.get('enddate', type=str))).timestamp() * 1000000

    # cohort_df = pd.read_csv("./cohort_data.csv")
    # retention_df = pd.read_csv("./retention.csv")
    cur = conn.cursor()
    cur.execute(f"SELECT event_timestamp, user_pseudo_id FROM myApp WHERE event_timestamp >= {start_date} AND event_timestamp <= {end_date};")
    df = cur.fetchall()
    df = pd.DataFrame(df, columns=['event_timestamp', 'user_pseudo_id'])

    df['event_datetime'] = pd.to_datetime(df['event_timestamp'] / 1e3, unit='ms').dt.tz_localize(None)
    df['event_date'] = df['event_datetime'].dt.date
    df['weekday'] = (df.event_datetime.dt.weekday + 2) % 7

    df['TransactionWeek'] = df['event_date'].apply(get_week)
    grouping = df.groupby('user_pseudo_id')['TransactionWeek']
    df['CohortWeek'] = grouping.transform('min')
    df['CohortIndex'] = df['TransactionWeek'] - df['CohortWeek']

    grouping = df.groupby(['CohortWeek', 'CohortIndex'])

    # Counting number of unique customer Id's falling in each group of CohortWeek and CohortIndex
    cohort_data = grouping['user_pseudo_id'].apply(pd.Series.nunique)
    cohort_data = cohort_data.reset_index()

    # Assigning column names to the dataframe created above
    cohort_counts = cohort_data.pivot(index='CohortWeek',
                                    columns ='CohortIndex',
                                    values = 'user_pseudo_id')

    cohort_sizes = cohort_counts.iloc[:,0]

    retention_df = cohort_counts.divide(cohort_sizes, axis=0).reset_index()

    data = []
    for _, row in cohort_data.iterrows():
        data.append({
            "cohort_date": int(row.CohortWeek),
            "period_date": int(row.CohortWeek + row.CohortIndex),
            "users": int(row.user_pseudo_id), 
            "period_number": int(row.CohortIndex), 
            "percentage": float(retention_df[retention_df['CohortWeek'] == row.CohortWeek][row.CohortIndex].values[0])
            })


    # def data_dict(consmptions):
    #     return dict(zip(["cohort_date", "period_date", "users", "period_number", "percentage"],
    #      consmptions))

    # data = list(map(data_dict, cohort_df.values.tolist()))
    return json.dumps(data)

@app.route('/daily_activity', methods=["POST", "GET"])
def daily_activity():
    cur = conn.cursor()
    cur.execute(f"SELECT event_timestamp, user_pseudo_id, event_name, event_params FROM myApp WHERE event_name LIKE 'myApp%';")
    df = cur.fetchall()
    df = pd.DataFrame(df, columns=['event_timestamp', 'user_pseudo_id', 'event_name', 'event_params'])

    df['event_datetime'] = pd.to_datetime(df['event_timestamp'] / 1e3, unit='ms').dt.tz_localize(None) + timedelta(hours=3, minutes=30)

    df['event_date'] = df['event_datetime'].dt.date

    df['event_hour'] = df['event_datetime'].dt.hour

    user_hourly_df = df.groupby(['user_pseudo_id', 'event_date', 'event_hour'])['event_datetime'].first().reset_index()
    user_daily_df = df.groupby(['user_pseudo_id', 'event_date'])['event_datetime'].first().reset_index()

    user_daily_df['lifetime'] = (user_daily_df.groupby('user_pseudo_id')['event_datetime'].transform('max')
     - user_daily_df.groupby('user_pseudo_id')['event_datetime'].transform('min')).dt.days

    user_daily_freqs_df = user_daily_df.groupby('user_pseudo_id')['lifetime'].agg(['count', 'first'])
    user_daily_freqs_df = user_daily_freqs_df[user_daily_freqs_df['first'] > 14]
    user_daily_freqs_df = user_daily_freqs_df['count'] / user_daily_freqs_df['first']

    c1 = user_daily_freqs_df[user_daily_freqs_df >= 0.5].index
    c1_df = user_daily_df[user_daily_df.user_pseudo_id.isin(c1)].reset_index()
    c1_df = c1_df.groupby('event_date')['user_pseudo_id'].count()

    c2 = (user_daily_freqs_df[(user_daily_freqs_df >= 0.2) & (user_daily_freqs_df < 0.5)]).index
    c2_df = user_daily_df[user_daily_df.user_pseudo_id.isin(c2)].reset_index()
    c2_df = c2_df.groupby('event_date')['user_pseudo_id'].count()

    c3 = (user_daily_freqs_df[(user_daily_freqs_df >= 0.1) & (user_daily_freqs_df < 0.2)]).index
    c3_df = user_daily_df[user_daily_df.user_pseudo_id.isin(c3)].reset_index()
    c3_df = c3_df.groupby('event_date')['user_pseudo_id'].count()

    c4 = (user_daily_freqs_df[user_daily_freqs_df < 0.1]).index
    c4_df = user_daily_df[user_daily_df.user_pseudo_id.isin(c4)].reset_index()
    c4_df = c4_df.groupby('event_date')['user_pseudo_id'].count()

    time_  = c1_df.index.astype(str).values.tolist()
    c1_pattern = c1_df.values.tolist()
    c2_pattern = c2_df.values.tolist()
    c3_pattern = c3_df.values.tolist()
    c4_pattern = c4_df.values.tolist()

    hourly_freq_df = user_hourly_df.groupby(['event_hour'])['event_datetime'].count()
    hourly_freq_df /= hourly_freq_df.sum()
    
    hours_ = hourly_freq_df.index.values.tolist()
    hourly_pattern = hourly_freq_df.values.tolist()

    data = list(zip(time_, c1_pattern, c2_pattern, c3_pattern, c4_pattern))

    data = list(map(lambda x: {
                'datetime': x[0], 'frequenters': x[1]
                , 'moderate': x[2], 'meh': x[3], 'apathetic': x[4]}, data))

    data = {'visits': data, 'portions': [
        {'name': 'frequenters',
        'value': len(c1)},
        {'name': 'moderate',
        'value': len(c2)}, 
        {'name': 'meh',
        'value': len(c3)}, 
        {'name': 'apathetic',
        'value': len(c4)}
        ],
        'hourly_distribution': list(map(lambda x: {'hour': x[0], 'value': x[1]}, list(zip(hours_, hourly_pattern))))
        }

    return json.dumps(data)

@app.route('/hourly_one_event_activity', methods=["POST", "GET"])
def hourly_one_event_activity():
    event_name = request.args.get('event_name', type=str)

    cur = conn.cursor()
    cur.execute(f"SELECT event_timestamp, user_pseudo_id FROM myApp WHERE event_name = '{event_name}';")
    df = cur.fetchall()
    df = pd.DataFrame(df, columns=['event_timestamp', 'user_pseudo_id'])

    df['event_datetime'] = pd.to_datetime(df['event_timestamp'] / 1e3, unit='ms').dt.tz_localize(None) + timedelta(hours=3, minutes=30)
    df['event_date'] = df['event_datetime'].dt.date
    df['event_hour'] = df['event_datetime'].dt.hour

    df = df.groupby(['user_pseudo_id', 'event_date', 'event_hour'])['event_datetime'].first().reset_index()

    df = df.groupby(['event_hour'])['event_datetime'].count()
    # df /= df.sum()

    hours_ = df.index.values.tolist()
    hourly_pattern = df.values.tolist()

    data = list(
            map(lambda x: {'name': x[0], 'value': x[1]}, 
            list(zip(hours_, hourly_pattern))
            ))
    
    return json.dumps(data)

@app.route('/get_event_names', methods=["POST", "GET"])
def get_event_names():

    cur = conn.cursor()
    cur.execute(f"SELECT DISTINCT event_name FROM myApp WHERE event_name LIKE 'myApp%';")
    df = cur.fetchall()
    
    return json.dumps(df)

@app.route('/myApp_open_reader_activity', methods=["POST", "GET"])
def myApp_open_reader_activity():
    cur = conn.cursor()
    cur.execute(f"SELECT event_timestamp, user_pseudo_id, event_name, event_params FROM myApp WHERE event_name = 'myApp_open_reader';")
    df = cur.fetchall()
    df = pd.DataFrame(df, columns=['event_timestamp', 'user_pseudo_id', 'event_name', 'event_params'])

    df['event_datetime'] = pd.to_datetime(df['event_timestamp'] / 1e3, unit='ms').dt.tz_localize(None) + timedelta(hours=3, minutes=30)
    df['event_date'] = df['event_datetime'].dt.date
    df['event_hour'] = df['event_datetime'].dt.hour

    myApp_open_reader_hourly_df = df[df['event_name'] == 'myApp_open_reader'].groupby(
        ['user_pseudo_id', 'event_date', 'event_hour'])['event_datetime'].first().reset_index()
    
    myApp_open_reader_hourly_df['count'] = myApp_open_reader_hourly_df.groupby(
        'user_pseudo_id')['event_hour'].transform('count')

    myApp_open_reader_hourly_df = myApp_open_reader_hourly_df[myApp_open_reader_hourly_df['count'] >= 5].groupby(
        'user_pseudo_id')['event_hour'].agg(lambda x: stats.mode(x)[0][0]).reset_index()
        
    event_df = myApp_open_reader_hourly_df.groupby(['event_hour'])['user_pseudo_id'].count()
    event_df /= event_df.sum()

    hours_ = event_df.index.values.tolist()
    hourly_pattern = event_df.values.tolist()

    data = {
        'myApp_open_reader_hourly_distribution': list(
            map(lambda x: {'hour': x[0], 'value': x[1]}, list(zip(hours_, hourly_pattern)))),
        'myApp_open_reader_hourly_list': list(
            map(lambda x: {'user': x[0], 'hour': x[1], 'index': x[2]},
             list(zip(myApp_open_reader_hourly_df['user_pseudo_id'],
              myApp_open_reader_hourly_df['event_hour'],
              myApp_open_reader_hourly_df.index.values.tolist()
              )))),
        }
    
    return json.dumps(data)

@app.route('/user_open_reader_activity', methods=["POST", "GET"])
def user_open_reader_activity():
    cur = conn.cursor()
    cur.execute(f"SELECT event_timestamp, user_pseudo_id, event_name, event_params FROM myApp WHERE event_name = 'myApp_open_reader';")
    df = cur.fetchall()
    df = pd.DataFrame(df, columns=['event_timestamp', 'user_pseudo_id', 'event_name', 'event_params'])

    df['event_datetime'] = pd.to_datetime(df['event_timestamp'] / 1e3, unit='ms').dt.tz_localize(None) + timedelta(hours=3, minutes=30)
    df['event_date'] = df['event_datetime'].dt.date
    df['event_hour'] = df['event_datetime'].dt.hour

    myApp_open_reader_hourly_df = df.groupby(
        ['user_pseudo_id', 'event_date', 'event_hour'])['event_datetime'].first().reset_index()
    
    myApp_open_reader_hourly_df['count'] = myApp_open_reader_hourly_df.groupby(
        'user_pseudo_id')['event_hour'].transform('count')

    myApp_open_reader_hourly_df = myApp_open_reader_hourly_df[myApp_open_reader_hourly_df['count'] >= 5]

    visits = myApp_open_reader_hourly_df[
    myApp_open_reader_hourly_df['user_pseudo_id'] == myApp_open_reader_hourly_df['user_pseudo_id'].sample().values[0]].set_index(
    'event_date')['event_hour']

    time_1  = visits.index.astype(str).values.tolist()
    hourly_pattern1 = visits.values.tolist()

    visits = myApp_open_reader_hourly_df[
    myApp_open_reader_hourly_df['user_pseudo_id'] == myApp_open_reader_hourly_df['user_pseudo_id'].sample().values[0]].set_index(
    'event_date')['event_hour']

    time_2  = visits.index.astype(str).values.tolist()
    hourly_pattern2 = visits.values.tolist()

    visits = myApp_open_reader_hourly_df[
    myApp_open_reader_hourly_df['user_pseudo_id'] == myApp_open_reader_hourly_df['user_pseudo_id'].sample().values[0]].set_index(
    'event_date')['event_hour']

    time_3  = visits.index.astype(str).values.tolist()
    hourly_pattern3 = visits.values.tolist()

    visits = myApp_open_reader_hourly_df[
    myApp_open_reader_hourly_df['user_pseudo_id'] == myApp_open_reader_hourly_df['user_pseudo_id'].sample().values[0]].set_index(
    'event_date')['event_hour']

    time_4 = visits.index.astype(str).values.tolist()
    hourly_pattern4 = visits.values.tolist()


    data = {
        'userOpenReader1': list(
            map(lambda x: {'date': x[0], 'hour': x[1]}, list(zip(time_1, hourly_pattern1)))),
        'userOpenReader2': list(
            map(lambda x: {'date': x[0], 'hour': x[1]}, list(zip(time_2, hourly_pattern2)))),
        'userOpenReader3': list(
            map(lambda x: {'date': x[0], 'hour': x[1]}, list(zip(time_3, hourly_pattern3)))),
        'userOpenReader4': list(
            map(lambda x: {'date': x[0], 'hour': x[1]}, list(zip(time_4, hourly_pattern4)))),
        }
    
    return json.dumps(data)

@app.route('/open_reader_item', methods=["POST", "GET"])
def open_reader_item():
    cur = conn.cursor()
    cur.execute(f"SELECT event_timestamp, user_pseudo_id, event_name, event_params FROM myApp WHERE event_name = 'myApp_open_reader';")
    df = cur.fetchall()
    df = pd.DataFrame(df, columns=['event_timestamp', 'user_pseudo_id', 'event_name', 'event_params'])
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM myApp_book_id_name;")
    book_id_name = cur.fetchall()
    book_id_name = pd.DataFrame(book_id_name, columns=['id', 'name']).set_index('id')['name'].to_dict()

    df['event_datetime'] = pd.to_datetime(df['event_timestamp'] / 1e3, unit='ms').dt.tz_localize(None) + timedelta(hours=3, minutes=30)
    df['event_date'] = df['event_datetime'].dt.date
    df['event_hour'] = df['event_datetime'].dt.hour

    df['event_params'] = df['event_params'].apply(ast.literal_eval)

    df['myApp_part_id'] = df['event_params'].apply(
        lambda x: {r['key']: list(r['value'].values())[0] for r in x}['myApp_part_id']).astype(int)

    df['myApp_book_id'] = df['event_params'].apply(
        lambda x: {r['key']: list(r['value'].values())[0] for r in x}['myApp_book_id']).astype(int)

    df = df.groupby(
        ['user_pseudo_id', 'event_date', 'event_hour', 'myApp_book_id', 'myApp_part_id']).first().reset_index()

    book_part_count_df = df.groupby(
        ['myApp_book_id', 'myApp_part_id'])[['event_name']].count().reset_index()
        
    book_part_count_df['book_part'] = list(zip(book_part_count_df.myApp_book_id, book_part_count_df.myApp_part_id))
    book_part_count_df = book_part_count_df.sort_values('event_name').tail(10).sort_values(
        ['myApp_book_id', 'event_name'], ascending=False)

    book_part_count_df['color_index'] = (book_part_count_df.groupby(['myApp_book_id']).apply(
        lambda x: range(len(x))).explode().reset_index().sort_values('myApp_book_id', ascending=False)[0]).values

    book_count_df = book_part_count_df.groupby(
        ['myApp_book_id'])[['event_name']].sum().reset_index()

    hourly_1 = df[df['myApp_book_id'] == 1].groupby(['event_hour'])['event_datetime'].count()
    hourly_4 = df[df['myApp_book_id'] == 4].groupby(['event_hour'])['event_datetime'].count()
    hourly_5 = df[df['myApp_book_id'] == 5].groupby(['event_hour'])['event_datetime'].count()
    hourly_7 = df[df['myApp_book_id'] == 7].groupby(['event_hour'])['event_datetime'].count()

    data = {
        'bookPartCount': list(
            map(lambda x: {'name': x[0], 'value': x[1], 'book': x[2], 'color_index': x[3]},
             list(zip(
                itemgetter(*book_part_count_df['myApp_part_id'].values)(book_id_name),
                book_part_count_df['event_name'].values.tolist(),
                book_part_count_df['myApp_book_id'].values.tolist(),
                book_part_count_df['color_index'].values.tolist()
                )))),
        'bookCount': list(
            map(lambda x: {'name': x[0], 'value': x[1]},
            list(zip(book_count_df['myApp_book_id'].values.tolist(),
            book_count_df['event_name'].values.tolist())))),
        'hourlyBook1': list(
            map(lambda x: {'name': x[0], 'value': x[1]}, 
            list(zip(hourly_1.index.values.tolist(),
             hourly_1.values.tolist()))
            )),
        'hourlyBook4': list(
            map(lambda x: {'name': x[0], 'value': x[1]}, 
            list(zip(hourly_4.index.values.tolist(),
             hourly_4.values.tolist()))
            )),
        'hourlyBook5': list(
            map(lambda x: {'name': x[0], 'value': x[1]}, 
            list(zip(hourly_5.index.values.tolist(),
             hourly_5.values.tolist()))
            )),
        'hourlyBook7': list(
            map(lambda x: {'name': x[0], 'value': x[1]}, 
            list(zip(hourly_7.index.values.tolist(),
             hourly_7.values.tolist()))
            ))
        }
    
    return json.dumps(data)

@app.route('/reading_habit', methods=["POST", "GET"])
def reading_habit():
    cur = conn.cursor()
    cur.execute(f"SELECT event_timestamp, user_pseudo_id, event_name, event_params FROM myApp WHERE event_name = 'myApp_open_reader';")
    df = cur.fetchall()
    df = pd.DataFrame(df, columns=['event_timestamp', 'user_pseudo_id', 'event_name', 'event_params'])

    df['event_datetime'] = pd.to_datetime(df['event_timestamp'] / 1e3, unit='ms').dt.tz_localize(None) + timedelta(hours=3, minutes=30)
    df['event_date'] = df['event_datetime'].dt.date
    df['event_hour'] = df['event_datetime'].dt.hour

    df['event_params'] = df['event_params'].apply(ast.literal_eval)

    df['myApp_part_id'] = df['event_params'].apply(
        lambda x: {r['key']: list(r['value'].values())[0] for r in x}['myApp_part_id']).astype(int)

    df['myApp_book_id'] = df['event_params'].apply(
        lambda x: {r['key']: list(r['value'].values())[0] for r in x}['myApp_book_id']).astype(int)

    df = df.groupby(
        ['user_pseudo_id', 'event_date', 'event_hour', 'myApp_book_id', 'myApp_part_id']).first().reset_index()

    df = df.groupby(
    ['user_pseudo_id', 'myApp_book_id'])[['event_hour']].count().unstack(fill_value=0)

    sample1, sample2, sample3, sample4 = df.sample(), df.sample(), df.sample(), df.sample()

    data = {
        'reading_habit_sample1': list(
            map(lambda x: {'name': x[0], 'value': x[1]},
             list(zip(sample1.columns.levels[1].values.tolist(), sample1.values[0].tolist()))
             )),
        'reading_habit_sample2': list(
            map(lambda x: {'name': x[0], 'value': x[1]},
             list(zip(sample2.columns.levels[1].values.tolist(), sample2.values[0].tolist()))
             )),
        'reading_habit_sample3': list(
            map(lambda x: {'name': x[0], 'value': x[1]},
             list(zip(sample3.columns.levels[1].values.tolist(), sample3.values[0].tolist()))
             )),
        'reading_habit_sample4': list(
            map(lambda x: {'name': x[0], 'value': x[1]},
             list(zip(sample4.columns.levels[1].values.tolist(), sample4.values[0].tolist()))
             ))
        }
    
    return json.dumps(data)

@app.route('/most_searched_item', methods=["POST", "GET"])
def most_searched_item():
    cur = conn.cursor()
    cur.execute(f"SELECT event_timestamp, user_pseudo_id, event_name, event_params FROM myApp WHERE event_name = 'myApp_search_event';")
    df = cur.fetchall()
    df = pd.DataFrame(df, columns=['event_timestamp', 'user_pseudo_id', 'event_name', 'event_params'])

    df['event_datetime'] = pd.to_datetime(df['event_timestamp'] / 1e3, unit='ms').dt.tz_localize(None) + timedelta(hours=3, minutes=30)
    df['event_date'] = df['event_datetime'].dt.date
    df['event_hour'] = df['event_datetime'].dt.hour

    df['event_params'] = df['event_params'].apply(ast.literal_eval)

    def search_bookId_extractor(x):
        d = {r['key']: list(r['value'].values())[0] for r in x}
        
        if 'myApp_search_bookId' not in d.keys():
            d['myApp_search_bookId'] = -1
        
        return d['myApp_search_bookId']

    df['myApp_search_bookId'] = df['event_params'].apply(search_bookId_extractor).astype(int)

    df['myApp_search_partId'] = df['event_params'].apply(
        lambda x: {r['key']: list(r['value'].values())[0] for r in x}['myApp_search_partId']).astype(int)

    df = df.groupby(
    'myApp_search_partId')['myApp_search_bookId'].agg(['count', 'first'])

    df = df.sort_values(
        'count').tail(10).reset_index().sort_values(['first', 'count'], ascending=False).reset_index(drop=True)

    df['color_index'] = (df.groupby(['first']).apply(
        lambda x: range(len(x))).explode().reset_index().sort_values('first', ascending=False)[0]).values

    data = {
        'searchPartBookCount': list(
            map(lambda x: {'name': x[0], 'value': x[1], 'book': x[2], 'color_index': x[3]},
             list(zip(
                df['myApp_search_partId'].values.tolist(),
                df['count'].values.tolist(),
                df['first'].values.tolist(),
                df['color_index'].values.tolist()
                )))),
        }
    
    return json.dumps(data)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5002)
