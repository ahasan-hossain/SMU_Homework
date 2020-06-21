import datetime as dt
import numpy as np
import pandas as pd
import json

#My SQL Class I wrote
from sqlHelper import SQLHelper
from flask import Flask, jsonify

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

sqlHelper = SQLHelper()

#################################################
# Flask Routes
#################################################
@app.route("/api/v1.0/precipitation")
def get_Precip():
    data = sqlHelper.get_Precip()
    #convert to json string
    data = data.to_json(orient='records')
    #convert to list
    data = json.loads(data)
    #return jsonify
    return(jsonify(data))

#Return a JSON list of stations from the dataset.
@app.route("/api/v1.0/stations")
def getStations(): #insert a variable
    data = sqlHelper.getStations()
    return(jsonify(json.loads(data.to_json(orient='records')))) #hack it all into one line

#Query the dates and temperature observations of the most active station for the last year of data.
@app.route("/api/v1.0/tobs")
def get_TOBS(): #insert a variable
    data = sqlHelper.get_TOBS()
    return(jsonify(json.loads(data.to_json(orient='records')))) #hack it all into one line

#Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.
#When given the start only, calculate TMIN, TAVG, and TMAX for all dates greater than and equal to the start date.
#When given the start and the end date, calculate the TMIN, TAVG, and TMAX for dates between the start and end date inclusive.

@app.route("/api/v1.0/temperature/<start>")
def get_date_TOB(start): #insert a variable
    data = sqlHelper.get_date_TOB(start)
    return(jsonify(json.loads(data.to_json(orient='records')))) #hack it all into one line

@app.route("/api/v1.0/temperature/<start>/<end>")
def getTemp_inRange(start, end): #insert a variable
    data = sqlHelper.getTemp_inRange(start, end)
    return(jsonify(json.loads(data.to_json(orient='records')))) #hack it all into one line

@app.route("/")
def home():
    return (
        f"Welcome to the Hawaii Data API!<br/>"

        f"""
        <ul>
            <li><a target="_blank" href='/api/v1.0/precipitation'>Get Total Precipitation</a></li>
            <li><a target="_blank" href='/api/v1.0/stations'>Get All Stations</a></li>
            <li><a target="_blank" href='/api/v1.0/tobs'>Get Temperature for Most Active Station</a></li>
            <li><a target="_blank" href='/api/v1.0/temperature/2017-08-23'>Get Temperature for Date</a></li>
            <li><a target="_blank" href='/api/v1.0/temperature/2016-09-23/2017-05-23'>Get Temperature for Date Range</a></li>
        </ul>
        """
    )


#################################################
# Flask Run
#################################################
if __name__ == "__main__":
    app.run(debug=True)
