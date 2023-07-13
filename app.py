from flask import Flask, render_template,jsonify,request,session,redirect,flash
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import base64
import io

app = Flask( __name__ )
app.secret_key = 'hfaiuhy18IUIUD1U'
data = pd.DataFrame([])
@app.route('/')
def index():
    return render_template('home.html')

@app.route('/column_names')
def get_data():
    return jsonify(data.columns.to_list())

@app.route('/upload', methods=['POST'])
def upload():
    global data
    file = request.files['file']
    if file.filename == '':
        flash('No file selected. Please choose a file.')
        return redirect('/')
    try:
        data = pd.read_csv(file)
    except pd.errors.EmptyDataError:
        flash('The uploaded file is empty. Please choose a file with data.')
        return redirect('/')
    column_names = data.columns.tolist()
    session['column_names'] = column_names
    return redirect('/')

@app.route('/create_graph', methods=['POST'])
def create_graph():
    y_axis = request.form.get('y_axis')
    x_axis = request.form.get('x_axis')
    fig, ax = plt.subplots()
    sns.lineplot(data=data, x=x_axis, y=y_axis, ax=ax)
    image_buffer = io.BytesIO()
    plt.savefig(image_buffer, format='png')
    image_buffer.seek(0)
    image_base64 = base64.b64encode(image_buffer.getvalue()).decode('utf-8')
    plt.close(fig)
    return jsonify(image_data=image_base64)
