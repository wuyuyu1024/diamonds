from flask import Flask, request, jsonify, render_template
import pandas as pd 

app = Flask(__name__)

@app.route('/data', methods=['GET'])
def get_data():
    data = pd.read_csv('data/diamonds.csv', index_col=0)
    # return data
        # Transform the DataFrame into a list of dictionaries
    transformed_data = data.reset_index().to_dict(orient='records')
    return jsonify(transformed_data)

@app.route('/', methods=['GET'])
def vis():
    data = pd.read_csv('data/diamonds.csv', index_col=0)
    letters = ['D', 'E', 'F', 'G', 'H', 'I', 'J']
    return render_template('index.html', data=data, letters=letters)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)


