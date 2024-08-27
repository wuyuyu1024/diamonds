from flask import Flask, request, jsonify, render_template
import pandas as pd 

app = Flask(__name__)

@app.route('/data', methods=['GET'])
def get_data():
    data = pd.read_csv('data/diamonds.csv', index_col=0)
        # Transform the DataFrame into a list of dictionaries
    transformed_data = data.reset_index().to_dict(orient='records')
    return jsonify(transformed_data)

@app.route('/', methods=['GET'])
def vis():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)


