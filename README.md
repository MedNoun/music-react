# music-react
Music Moderation team - cohort of April-June 2022

(Peter Chudinov, Joseph Aquino, Mohamed Sahnoun)

## About this app:

This app will record and evaluate your piano performance by comparing it to a reference `midi` file of your choice.

### How it works:

1. The audio recording of you playing the piano is processed using Automatic Music Transcription deep learning algorithm and converted into a `midi` file
2. That `midi` file is aligned to and compared to a reference file
3. Results of comparison are digested into a human-readable format and displayed on screen

### Research notes:

https://mednoun.notion.site/Music-Moderation-Fellowship-AI-Cohort-23-cd83ce77d367465e93c755bca6c41113

## Steps for setting up the app:

This is a react native project which runs on expo 

1. download the expo go app from app store or play store
2. clone the repository
3. `nvm use 16.15.1` - expo doesn't work on newer versions of node
4. run `npm install` to install dependencies 
5. run `npm start` or `expo start` on the terminal
6. set your local ip address in `src/components/Recorder.js` (variable `baseURL`)
7. a qr code will show up scan it with your camera if you are on Iphone or open the expo app and scan it on android
8. the app should bundle and open up on your phone !
9. backend is available here: [joe-aquino/Music-Moderation-Backend](https://github.com/joe-aquino/Music-Moderation-Backend)

## Running/using the app:

1. Select reference piece you want to have evaluated in the dropdown box (you can manually add your own `.mid` files to the `reference_midi` directory on the backend)
2. Press `Start Recording`
3. Play the piano!
4. Press `Stop Recording`
5. Your recording is going to pop up. You can listen to it if you want, save it on your device or share it with friends. You can also record your performance again, in case you didn't like your current one
6. Press `Send` on the recording to have it evaulated
7. The feedback window will pop up soon after!

### Feedback explanation:

`markdown coloring might not work on github`

- **Black** notes mean you've played everything correctly
- **[Red](#)** note means that you have played a wrong note (different pitch)
- **[Blue](#)** note means that you haven't played this note (note is missing in your performance)

##### Fine print:

- reference BPM is hardcoded as 60 (backend)
- time signature is hardcoded as 4/4 (backend)
- extra notes are disabled due to phone recording quality (react-native issue)
- AMT can be used for live transcription, not in react-native though

