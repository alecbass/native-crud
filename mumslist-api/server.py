from flask import Flask, request, jsonify, Response, send_file
from flask_cors import CORS
import logging
import json
import io
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = '/files/'

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
#ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
#CORS(app, resource={r"/*": { "origins": "*" } })
CORS(app)

logger = logging.getLogger(__name__)

fileContents = []
files = []

@app.route("/", methods=["GET"])
def hello():
    return "Get request!"

def allowed_file(file):
  #return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
  return True

# NOTE(alec): https://flask.palletsprojects.com/en/1.1.x/api/#incoming-request-data
@app.route("/file/", methods=["POST"])
def upload_file():
  # check if the post request has the file part
  files.append(request.data)
  print(request.content_length)
  response = jsonify({"message": f"File {len(files)} uploaded."})
  response.status_code = 200
  print(response.data)
  print( f"File {len(files)} uploaded.")
  return response

@app.route("/file/count/", methods=["GET"])
def get_file_count():
  response = jsonify(len(files))
  response.status_code = 200
  return response

@app.route("/file/", methods=["GET"])
def get_file_indexes():
  # NOTE(alec): There is probably a much better way of doing this
  response = jsonify([i for i in range(len(files))])
  response.status_code = 200
  return response
  return Response(data=[i for i in range(len(files))], status=200)

@app.route("/file/<index>", methods=["GET"])
def download_file(index):
  fileIndex = int(index)
  if (len(files) == 0):
    response = jsonify({"message": "No files have been uploaded"})
    response.status_code = 404
    return response
  elif fileIndex < 0 or fileIndex > len(files):
    response = jsonify({"message" : "Given file index is out of range"})
    response.status_code = 404
    return response
  fileToSend = io.BytesIO()
  fileToSend.write(files[fileIndex - 1])
  fileToSend.seek(0)
  return send_file(fileToSend, attachment_filename="return.txt", as_attachment=True)

@app.route("/", methods=["POST"])
def post():
  return "Post request!"

@app.route("/file-contents/", methods=["POST"])
def upload_file_contents():
  print(request.method)
  print(request.json)
  fileContents.append(request.json)
  return "File contents upload!"