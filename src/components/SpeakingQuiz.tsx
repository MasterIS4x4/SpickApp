import { IonButton, IonIcon, IonText } from '@ionic/react'
import { useEffect, useState } from 'react'
import { DataTypeRenderer } from './DataTypeRenderer'
import { IWord } from '../model/lesson'
import { QuizDataType } from '../model/quiz'
import { mic } from 'ionicons/icons'

interface SpeakingQuizProps {
  words: IWord[]
  onNext: () => void
}

interface RecordingState {
  recording: boolean
  seconds: number
  mediaRecorder?: MediaRecorder
  chunks: Blob[]
  intervalId?: NodeJS.Timeout
  stream?: MediaStream
}

export const SpeakingQuiz = ({ words, onNext }: SpeakingQuizProps) => {
  const [hasMicPermission, setHasMicPermission] = useState(false)
  const [micAccessDenied, setMicAccessDenied] = useState(false)
  const [recordings, setRecordings] = useState<{ [wordId: string]: string | null }>({})
  const [states, setStates] = useState<{ [wordId: string]: RecordingState }>({})

  useEffect(() => {
    navigator.permissions
      ?.query({ name: 'microphone' as PermissionName })
      .then(result => {
        setHasMicPermission(result.state === 'granted' || result.state === 'prompt')
      })
      .catch(() => setHasMicPermission(false))
  }, [])

  const requestMicAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasMicPermission(true)
    } catch {
      alert('Microphone access denied or not available.')
      setMicAccessDenied(true)
    }
  }

  const startRecording = async (wordId: string) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const mediaRecorder = new MediaRecorder(stream)
    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = e => {
      console.log('Data available:', e.data)
      chunks.push(e.data)
    }
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      const url = URL.createObjectURL(blob)
      setRecordings(prev => ({ ...prev, [wordId]: url }))
      stream.getTracks().forEach(track => track.stop())

      setStates(prev => {
        const updated = { ...prev[wordId], recording: false, intervalId: undefined }
        return { ...prev, [wordId]: updated }
      })
    }

    mediaRecorder.start()

    const intervalId = setInterval(() => {
      setStates(prev => {
        const current = prev[wordId]
        if (!current) return prev
        const newSeconds = current.seconds - 1
        if (newSeconds <= 0) {
          clearInterval(intervalId)
          mediaRecorder.stop()
        }
        return {
          ...prev,
          [wordId]: {
            ...current,
            seconds: newSeconds,
          },
        }
      })
    }, 1000)

    setStates(prev => ({
      ...prev,
      [wordId]: {
        recording: true,
        seconds: 20,
        mediaRecorder,
        chunks,
        intervalId,
        stream,
      },
    }))
  }

  const stopRecording = (wordId: string) => {
    const state = states[wordId]
    if (state?.mediaRecorder && state.recording) {
      state.mediaRecorder.stop()
      clearInterval(state.intervalId)
    }
  }

  return (
    <div className="ion-padding" style={{ textAlign: 'center' }}>
      <h2> Say each word out loud 🗣</h2>

      {!hasMicPermission && !micAccessDenied && (
        <IonButton onClick={requestMicAccess}>Allow Microphone</IonButton>
      )}

      {micAccessDenied && (
        <>
          <IonText color="danger">Microphone access denied. You can still continue.</IonText>
          <IonButton onClick={onNext}>Continue</IonButton>
        </>
      )}

      {hasMicPermission && !micAccessDenied && (
        <div style={{ width: '100%' }}>
          {words.map(word => {
            const state = states[word.id]
            const userRecording = recordings[word.id]
            return (
              <div
                key={word.id}
                style={{
                  border: '1px solid var(--ion-color-medium)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  backgroundColor: 'var(--ion-color-light)',
                }}
              >
                <div>
                  <DataTypeRenderer word={word} type={QuizDataType.Text} />
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <DataTypeRenderer word={word} type={QuizDataType.Audio} />
                </div>

                <div
                  style={{
                    marginTop: '0.75rem',
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'center',
                  }}
                >
                  <IonButton onClick={() => startRecording(word.id)} disabled={state?.recording}>
                    <IonIcon icon={mic} slot="start" />
                    {state?.recording ? `Recording... ${state.seconds}` : 'Start Recording'}
                  </IonButton>

                  <IonButton
                    onClick={() => stopRecording(word.id)}
                    disabled={!state?.recording}
                    color="danger"
                  >
                    Stop
                  </IonButton>
                </div>

                {userRecording && (
                  <div style={{ marginTop: '1rem' }}>
                    <audio controls src={userRecording} key={userRecording} />
                    <p>
                      <IonText color="medium">Your recording</IonText>
                    </p>
                  </div>
                )}
              </div>
            )
          })}
          <IonButton expand="block" onClick={onNext} style={{ marginTop: '1rem' }}>
            Continue
          </IonButton>
        </div>
      )}
    </div>
  )
}
