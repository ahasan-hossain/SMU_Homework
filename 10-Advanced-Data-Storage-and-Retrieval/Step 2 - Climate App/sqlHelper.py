###This is where we store our queries

import datetime as dt
import numpy as np
import pandas as pd
from sqlalchemy import create_engine

class SQLHelper():

    def __init__(self):
        self.connection_string = 'sqlite:///../Resources/hawaii.sqlite'
        self.engine = create_engine(self.connection_string)
#getTotalPrecipOnDates
    def get_Precip(self):
        query = f"""
                    SELECT 
                        date,sum(prcp) as total_precip
                    FROM
                        measurement
                    GROUP BY
                        date
                    ORDER BY
                        date;
                """

        conn = self.engine.connect()
        df = pd.read_sql(query, conn)
        conn.close()

        return df

    def getStations(self):
        query = f"""
            SELECT 
                station as Station_ID,name as Station_Name,latitude,longitude,elevation
            FROM
                station
            ORDER BY
                station_id;
            """

        conn = self.engine.connect()
        df = pd.read_sql(query, conn)
        conn.close()

        return df

    def get_TOBS(self):
        query = f"""
            SELECT 
                station,date,tobs as Temp
            FROM
                measurement
            WHERE 
                station = 'USC00519281' AND
                date > '2016-08-23'
            ORDER BY
                date ASC;
            """

        conn = self.engine.connect()
        df = pd.read_sql(query, conn)
        conn.close()

        return df

    
    def get_date_TOB(self, date):
        query = f"""
            SELECT 
                date, min(tobs) as Min_Temp, max(tobs) as Max_temp, avg(tobs) as Avg_temp
            FROM
                measurement
            WHERE
                date = '{date}'
            """

        conn = self.engine.connect()
        df = pd.read_sql(query, conn)
        conn.close()

        return df


    def getTemp_inRange(self, start, end):
        query = f"""
            SELECT 
                min(tobs) as Min_temp, max(tobs) as Max_temp, avg(tobs) as Avg_temp
            FROM
                measurement
            WHERE
                date >= '{start}'
                AND date < '{end}'
            """

        conn = self.engine.connect()
        df = pd.read_sql(query, conn)
        conn.close()

        return df