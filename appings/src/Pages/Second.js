import React, { useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

const Second = () => {
    const [wavesurfer, setWaveSurfer] = useState(null);
    const [record, setRecord] = useState(null);
    const [isRecordingActive, setIsRecordingActive] = useState(false);
    const [progressTime, setProgressTime] = useState('00:00');
    const [isDisplay,setIsDisplay]=useState(true);
    const [isRecDisplay, setIsRecDisplay] = useState(true);

    useEffect(() => {
        setIsDisplay(false);
        const createWaveSurfer = () => {
        const wavesurferInstance = WaveSurfer.create({
            container: '#mic',
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
        });

        setWaveSurfer(wavesurferInstance);
        
        const recordInstance = wavesurferInstance.registerPlugin(
            RecordPlugin.create({ scrollingWaveform: true, renderRecordedAudio: false })
        );

        setRecord(recordInstance);

        recordInstance.on('record-end', (blob) => {
            const container = document.querySelector('#recordings');
            const recordedUrl = URL.createObjectURL(blob);

            const recordedWaveSurfer = WaveSurfer.create({
            container,
            waveColor: 'rgb(200, 100, 0)',
            progressColor: 'rgb(100, 50, 0)',
            url: recordedUrl,
            });

            const playButton = container.appendChild(document.createElement('button'));
            playButton.textContent = 'Play';
            playButton.onclick = () => recordedWaveSurfer.playPause();
            recordedWaveSurfer.on('pause', () => (playButton.textContent = 'Play'));
            recordedWaveSurfer.on('play', () => (playButton.textContent = 'Pause'));

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '100';
            slider.value = '0';
            slider.step = '1';
            slider.addEventListener('input', (e) => {
            const minPxPerSec = e.target.valueAsNumber;
            recordedWaveSurfer.zoom(minPxPerSec * 100);
            });
            container.appendChild(slider);

        });

        recordInstance.on('record-progress', (time) => {
            updateProgress(time);
        });
        };

        createWaveSurfer();

        // Clean up function
        return () => {
        if (wavesurfer) {
            wavesurfer.destroy();
        }
        };
    }, []);

    const updateProgress = (time) => {
        const formattedTime = [
        Math.floor((time % 3600000) / 60000), // minutes
        Math.floor((time % 60000) / 1000), // seconds
        ]
        .map((v) => (v < 10 ? '0' + v : v))
        .join(':');
        setProgressTime(formattedTime);
    };

    const startRecording = () => {
        const deviceId = 'default'; // You can modify this to use a selected device
        record.startRecording({ deviceId }).then(() => {
        setIsRecordingActive(true);
        setTimeout(stopRecording, 10000); // Stop recording after 10 seconds
        });
    };

    const stopRecording = () => {
        if (record.isRecording()) {
        record.stopRecording();
        setIsRecordingActive(false);
        setIsDisplay(true);
        setIsRecDisplay(false);
        }
    };

    const handleRecordButtonClick = () => {
        if (!isRecordingActive) {
        startRecording();
        } else {
        stopRecording();
        }

    

};

  return (
    <div>
        
        <div id="mic" style={{"border": "1px solid #ddd", "border-radius": '4px', 'margin': '0 auto', 'width': '50%', 'padding': '0px', 'text-align': 'center'}}>
            <label>
                <h2>
                Click on the record button and play the keyboard
                </h2>
            </label>
            <div id="progress">{progressTime}</div>
            <button id="record" onClick={handleRecordButtonClick} disabled={!isRecDisplay}>
                {isRecordingActive ? 'Stop' : 'Record'}
            </button>
        </div>
        <br></br>
        <div id="recordings" style={{'border': '1px solid #ddd', 'border-radius': '4px', 'margin': '0 auto', 'width': '50%', 'padding': '20px', 'text-align': 'center'}}></div>
        <button id="next" style={{'display': isDisplay?'block':'none', 'margin':'0 auto'}}>Next page</button>
    </div>
  )
}

export default Second

