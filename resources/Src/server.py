import os.path

from flask import Flask, send_from_directory, request

from rewriterFromCSV import RewriterFromCSV
from vocabulary import *

import functions as f

app = Flask(__name__)

app.config['SESSION_TYPE'] = 'filesystem'


voc: Vocabulary
rw: RewriterFromCSV

voc_file = "../Data/FlightsVoc.txt"
data_file = "../Data/extrait_2008.csv"
if os.path.isfile(voc_file):
    voc = Vocabulary(voc_file)
    if os.path.isfile(data_file):
        rw = RewriterFromCSV(voc, data_file, debug=False)
        rw.readAndRewrite()
    else:
        print(f"Data file {data_file} not found")
else:
    print(f"Voc file {voc_file} not found")


@app.route('/', defaults=dict(filename=None))
@app.route('/<path:filename>', methods=['GET'])
def index(filename):
    path = "public/" + (filename if isinstance(filename, str) else "index.html")
    return send_from_directory('.', path)


def config():
    partitions = {}
    for partition in voc.partitions.keys():
        partitions[partition] = voc.partitions[partition].modnames

    return {
        "data": partitions
    }


app.add_url_rule('/config', view_func=config, methods=['GET', 'POST'])


def data():
    global rw

    params = request.args

    rw.reset_filter()
    if len(params) > 0:
        filter = {
            params["filter"] + "." + params["subFilter"]: float(params["value"]),
        }

        rw.set_filter(filter)
        rw.filter()

    average = rw.average()
    if average:
        return {
                    "data": average
               }, 200
    else:
        return {
            "error": "No flight found"
        }, 200


app.add_url_rule('/data', view_func=data, methods=['GET', 'POST'])


def assoc():
    global rw

    params = request.args

    if len(params) > 3:
        filter = {
            params["filter"] + "." + params["subFilter"]: float(params["value"]),
        }

        filter2 = params["filter2"] + "." + params["subFilter2"]

        try:
            result = f.assoc(rw, filter, filter2)
            result2 = f.atypical(rw, filter, filter2)
        except Exception:
            return {
                "error": "No flights data found for this filter"
            }
        return {
                    "data": result,
                    "data2": result2
               }, 200
    else:
        return {
            "error": "Both filters are necessary to calculate the correlation rate"
        }, 200


app.add_url_rule('/assoc', view_func=assoc, methods=['GET', 'POST'])


if __name__ == "__main__":
    app.run()
