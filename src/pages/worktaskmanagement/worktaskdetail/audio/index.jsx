import React from 'react'
import {
  Icon,Slider, Switch
} from 'antd';
import moment from 'moment'
import ReactPlayer from 'react-player'
import city from 'utils/city'
import styles from './index.less'
import { audioTime } from 'utils/mm'



let hhh = 0
let mmm = 0
let sss = 0

class Audio extends React.Component {


    state = {
        totalTime: '',
        playTime: '00:00:00',
        sliderValue: 0,
        sliderMax: 0
    }

    // 关闭录音
    handleCloseAudio = (e) => {
      const { payload } = e
        this.props.onCloseAudio(payload)
    }

    handlePlay = (e) => {
        const { payload } = e
        this.props.onPlayAduio(payload)
    }

    handlePause = (e) => {
        const { payload } = e
        this.props.onPasueAudio(payload)
    }

    handleOnStart = () => {

    }

    handleDuration = (e) => {
        this.setState({
            sliderMax: e
        })
        this.setState({
            totalTime: audioTime(e)
        })

    }

    handleProgress = (e) => {
        let s = parseInt(e.playedSeconds)
        if( s > 0) {
            this.setState({
                playTime: audioTime(s,mmm,hhh),
                sliderValue: e.playedSeconds
            })
        }
    }

    handleOnChangeSlider = (e) =>{
        let s = parseInt(e)
        if( s > 0) {
            this.setState({
                playTime: audioTime(s,mmm,hhh),
                sliderValue: e
            })
        }
        this.player.seekTo(parseFloat(e))
    }

    handleOnEnded = (e)=> {
        this.props.onPasueAudio()
    }

    ref = player => {
        this.player = player
    }

    render() {
        const { recordUrl,playing } = this.props
        const { sliderValue,sliderMax,playTime,totalTime} = this.state

        return (
            <div className={styles.serchBox}>
                 <ReactPlayer
                   url={recordUrl}
                   playing={playing}
                   ref={this.ref}
                   onEnded={(e) => this.handleOnEnded(e) }
                   className={styles.ReactPlayer}
                   onDuration= { (e) => this.handleDuration(e)}
                   onProgress= { (e) => this.handleProgress(e)}
                />
                 <div className={styles.viruralAudio}>
                    <div className={styles.callInfo}>
                        { playing ?
                          <span className={styles.pauseBtn}><Icon type="pause-circle" onClick={()=> this.handlePause(this.props)}/></span> :
                          <span className={styles.playBtn}><Icon type="play-circle" onClick={()=> this.handlePlay(this.props)}/></span>
                        }
                        <Slider value={sliderValue} className={styles.slider} min={0} max={sliderMax} tooltipVisible={false} onChange={(e)=>{ this.handleOnChangeSlider(e)}}/>
                        <span className={styles.time}>{playTime}/{totalTime}</span>
                    </div>
                    <Icon type="close" className={styles.close} onClick={ () => this.handleCloseAudio(this.props)} />
                 </div>
            </div>
        )
    }
}


export default Audio
