import axios from 'axios'
import { useState } from 'react'
import { extract } from './utils/extractText'
import { GrNext, GrPrevious } from 'react-icons/gr'

function App() {
  const [fileError, setFileError] = useState()
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState()
  const [texts, setTexts] = useState([])
  const [current, setCurrent] = useState(0)

  const handleFile = (e) => {
    const file = e.target.files[0]
    if(file.type.includes('video') || file.type.includes('audio')){
      setFile(file)
      setFileError('')
    } else {
      setFileError('Choose an audio file.')
      setFile()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('audio_file', file)
    try{
      const response = await axios.post(
        'https://cors-anywhere.herokuapp.com/https://whisper.lablab.ai/asr',
        formData
      )
      setTexts(
        response.data.segments.map(s => extract(s.text))
      )
      setLoading(false)
    }catch(err){
      console.error(err)
      setLoading(false)
    }
  }

  const prev = () => {
    if(current === 0 ) {
      setCurrent(texts.length - 1)
    }else {
      setCurrent(current - 1)
    }
  }

  const next = () => {
    if(current === texts.length - 1 ) {
      setCurrent(0)
    }else {
      setCurrent(current + 1)
    }
  }

  // console.log(texts)

  return (
    <main className='main'>
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Audio File</label>
          <input name='audio' type='file' onChange={handleFile}/>
          {fileError ? <span>{fileError}</span> : null}
        </div>
        <div className='button-wrapper'>
          <button>
            Transcribe
          </button>
        </div>
      </form>
      {texts.length > 1 ? 
        <div className="texts">
          <div className='navigate_button'>
            <GrPrevious onClick={prev}/>
          </div>
          <div className='segment'>
            <p>{texts[current]?.segment}</p>
            <div className="words-wrapper">
              {texts[current]?.letters.map(word => 
              <div className='word-wrapper'>
                <p className='word'>
                  {word.join('')}
                </p>
                <div className='asl-wrapper'>
                { 
                  word.map(letter =>
                    <div>
                      <img className='letter' src={`/en/${letter}.png`} alt={letter}/>
                    </div>
                  )
                }
                </div>
              </div>
            )}
            </div>
          </div>
          <div className="navigate_button">
            <GrNext onClick={next}/>
          </div>
      </div>
      : null}
    </div>
    </main>
  )
}

export default App
