import { IonButton, IonText } from '@ionic/react'
import { ISpeakingQuiz } from '../model/quiz'
import { useEffect, useState } from 'react'
import { DataTypeRenderer } from './DataTypeRenderer'

interface SpeakingQuizProps {
  quiz: ISpeakingQuiz
  onNext: () => void
}

export const SpeakingQuiz = ({ quiz, onNext }: SpeakingQuizProps) => {
  const [recording, setRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(6)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [hasMicPermission, setHasMicPermission] = useState<boolean>(false)
  const [micAccessDenied, setMicAccessDenied] = useState(false)

  useEffect(() => {
    navigator.permissions
      ?.query({ name: 'microphone' as PermissionName })
      .then(result => {
        setHasMicPermission(result.state === 'granted' || result.state === 'prompt')
      })
      .catch(() => {
        setHasMicPermission(false)
      })
  }, [])

  const requestMicAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasMicPermission(true)
    } catch (err) {
      alert('Microphone access denied or not available.')
      setMicAccessDenied(true)
    }
  }

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = e => chunks.push(e.data)
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      setAudioUrl(URL.createObjectURL(blob))
    }

    mediaRecorder.start()
    setRecording(true)
    setRecordingSeconds(6)

    const countdownInterval = setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval)
          mediaRecorder.stop()
          setRecording(false)
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div
      className="ion-padding"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        textAlign: 'center',
      }}
    >
      <h2 style={{ fontSize: '1.5rem' }}>{quiz.question}</h2>

      {quiz.words.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <DataTypeRenderer word={quiz.words[0]} type={quiz.inputTypes[0]} />
        </div>
      )}

      {!hasMicPermission && !micAccessDenied ? (
        <IonButton color="medium" onClick={requestMicAccess}>
          Allow Microphone
        </IonButton>
      ) : null}

      {micAccessDenied && (
        <>
          <IonText color="danger">Microphone access denied. You can still continue.</IonText>
          <IonButton onClick={onNext}>Continue</IonButton>
        </>
      )}

      {hasMicPermission && !micAccessDenied && (
        <IonButton onClick={startRecording} disabled={recording}>
          {recording ? `Recording... ${recordingSeconds}` : 'Start Recording'}
        </IonButton>
      )}

      {audioUrl && (
        <>
          <audio controls src={audioUrl}></audio>
          <IonText color="medium">
            Compare your pronunciation and press continue if your voice match.
          </IonText>
          <IonButton onClick={onNext}>Continue</IonButton>
        </>
      )}
    </div>
  )
}
