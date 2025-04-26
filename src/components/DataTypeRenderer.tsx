import {IWord} from "../model/lesson"
import {QuizDataType} from "../model/quiz"
import {IonImg, IonText} from "@ionic/react"
import {useEffect, useState} from "react"

interface DataTypeRendererProps {
  word: IWord
  type: QuizDataType
}

export const DataTypeRenderer = (props: DataTypeRendererProps) => {
  const { word, type } = props
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined)
  const [audioType, setAudioType] = useState<string | undefined>(undefined)
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (Array.isArray(word.audioUrl)) {
      const randomIndex = Math.floor(Math.random() * word.audioUrl.length)
      setAudioUrl(word.audioUrl[randomIndex])
      setAudioType(word.audioUrl[randomIndex].split('.').pop() || 'mp3')
    } else {
      setAudioUrl(word.audioUrl)
      setAudioType(word.audioUrl.split('.').pop() || 'mp3')
    }

    if (Array.isArray(word.imageUrl)) {
      const randomIndex = Math.floor(Math.random() * word.imageUrl.length)
      setImageUrl(word.imageUrl[randomIndex])
    } else {
      setImageUrl(word.imageUrl)
    }
  }, [word])

  switch(type) {
    case QuizDataType.Text:
      return <IonText style={{ fontSize: '1rem'}}>{word.nameRO} - {word.nameEN}</IonText>
    case QuizDataType.Audio:
      return audioUrl ? <audio controls>
        <source src={audioUrl} type={"audio/"+audioType} />
        Your browser does not support the audio element.
      </audio> : "Audio not available"
    case QuizDataType.Image:
      return <IonImg
        src={imageUrl}
        alt="Alternative text not available"
        style={{
          display: 'block',
          width: 'auto',
          height: 'auto',
          maxHeight: 'var(--image-max-height, 50vmax)',
          maxWidth: 'var(--image-max-width, 70vmin)'
        }}
        // className="responsive-image"
      />
    default:
      return null
  }
}