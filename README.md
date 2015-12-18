Does your company have an annoying Slack channel that you've tried to leave, but can't because any time your username is mentioned it automatically adds you back? Well, today is your lucky day. **Seeya** is a bot that monitors a list of channel IDs for your username. Every time a mention comes through it leaves the channel for you.

## Run it using Docker


### Pull it
```
docker pull projectweekend/seeya
```


## Configure it
Configuration is saved in a JSON file and passed to the bot via a command line arg:
```
{
    "token": "your-slack-token",
    "channels": [
        "id-for-slack-channel",
        "id-for-another-channel"
    ],
    "targetString": "your_username"
}
```


## Launch it

Two volumes need to be mounted into the running container, one for the config file and one for the log file:

```
docker run -v /path/to/config.json:/src/config.json -v /var/tmp/seeya_logs.json:/var/tmp/seeya_logs.json projectweekend/seeya -c ./config.json
```
