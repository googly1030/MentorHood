FROM python:3.11
WORKDIR /app

RUN apt-get update
RUN apt-get upgrade -y
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 9000
CMD ["uvicorn" , "app.main:app" , "--host" , "0.0.0.0" , "--port" , "9000" , "--reload"]
