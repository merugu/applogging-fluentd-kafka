# fluentd-unified-logging
This repo contain resources to publish application logs to Kafka topic

A) Kafka Resources:
# To setup kafka, zookeeper, schema registry on docker follow the below steps:
1) https://docs.confluent.io/current/quickstart/cos-docker-quickstart.html
#Kafka cli is command line kafka tool used to publish and consume messages 
2) https://www.apache.org/dyn/closer.cgi?path=/kafka/2.4.0/kafka_2.12-2.4.0.tgz
3)https://docs.spring.io/spring-boot/docs/current/reference/pdf/spring-boot-reference.pdf


B) FluentD resources:

# Define input plugin configuration(input is log file...tail input type is used to define the input config) 
1) https://docs.fluentd.org/input/tail
# Define output plugin configuration(output is kafka topic...kafka output type is used to define the output details) 
2) https://docs.fluentd.org/v/0.12/output/kafka
#Configuration link below is used to define configuration file used by fluentd
3) https://docs.fluentd.org/output/kafka#example-configuration
#Install Fluentd on mac osx
4) https://support.treasuredata.com/hc/en-us/articles/207048557-Installing-td-agent-on-MacOS-X-

C) Other resources:
1) https://github.com/Azure/azure-event-hubs-for-kafka/tree/master/tutorials/fluentd
#Log messages from http input plugin
2) https://docs.fluentd.org/input/http
#Use the below link to launch all the confluent kafka services
3) https://github.com/confluentinc/examples/tree/5.3.1-post/cp-all-in-one 
# Openshift deploy.yaml file configuration
https://github.com/CDCgov/openshift-fluentd-forwarder/blob/master/fluentd-forwarder-template.yaml


Step 1: Install docker on your laptop 
 a) Windows: https://docs.docker.com/docker-for-windows/install/
Mac: https://docs.docker.com/docker-for-mac/install/

Step 2: Setup local kafka environment using confluent gitrepo, Go through the link A1, Once setup is done
run "docker ps" it should show all the kafka services are running

Step 3: create a kafka topic called "messages" using  kafka cli
Download Kafka cli using A2
Extract the .tgz file and navigate to root directory then run below command to create kafka topic "messages"

bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic message

Step 4: Test kafka environment by opening two terminal windows one for consumer and one for producer
In producer terminal window: bin/kafka-console-producer.sh --broker-list localhost:9092 --topic messages
In Consumer terminal window: bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic messages --from-beginning
Now What ever message you are entering in producer window will appear in consumer window

Step 5: 
Using B4 install fluentd on system
Dy default the fluentd will provide conf file with few source and match tags
Run "sudo launchctl load /Library/LaunchDaemons/td-agent.plist" in new terminal   
Run "less /var/log/td-agent/td-agent.log" should show the fluentd services started with default config

Step 6: Stop the fluentd services using below command
"sudo launchctl unload /Library/LaunchDaemons/td-agent.plist"
Now it's time to update the configuration located in "/etc/td-agent/td-agent.conf"

Replace the content with below, you may need to change config based on your requirement using B3

<source>
  @type tail
  path /var/log/fluentd.log
  tag apache.access
  <parse>
    @type apache2
  </parse>
</source>
<match *.**>
  @type kafka2

  # list of seed brokers
  brokers localhost:9092
  use_event_time true

  # buffer settings
  <buffer topic>
    @type file
    path /var/log/td-agent/buffer/td
    flush_interval 3s
  </buffer>

  # data type settings
  <format>
    @type json
  </format>

  # topic settings
  default_topic messages

  # producer settings
  required_acks -1
  compression_codec gzip
</match>


Step 7: Restart the fluentd services using
"sudo launchctl load /Library/LaunchDaemons/td-agent.plist"

Step 8:Assuming nodejs app and kafka consumer and producer services are still running
curl -d '{"name":"value1", "email":"value2"}' -H "Content-Type: application/json" -X POST http://localhost:4000/submit-data

In Kafka consumer terminal you should be able to see the message received 


Steps to execute nodejs application:


Step1: npm install
Step2: node app.js

# PostData

curl -d '{"name":"value1", "email":"value2"}' -H "Content-Type: application/json" -X POST http://localhost:4000/submit-data

