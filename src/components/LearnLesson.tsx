import {ILesson} from "../model/lesson"
import YouTube from "react-youtube"
import {dvhToPx, dvwToPx} from "../utils"
import {useEffect, useState} from "react"

interface LearnLessonProps {
  lesson: ILesson
  autoPlay?: boolean
  onVideoEnd?: () => void
}

interface Size {
  width: number
  height: number
}

/**
 * The LearnLesson component renders a YouTube video player for a given lesson.
 */
export const LearnLesson = (props: LearnLessonProps) => {
  const [size, setSize] = useState<Size>({
    width: dvwToPx(95), height: dvhToPx(75)
  })

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: dvwToPx(95), height: dvhToPx(75)
      })
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getVideoId = (videoUrl: string) => {
    const tokens = videoUrl.split('=')
    if(tokens.length > 1) {
      return tokens[1]
    }
    throw new Error("Invalid video URL")
  }

  return ( // full with and height
    <div className={"ion-padding"} style={{width: "100%", height: "75dvh"}}>
      {props.lesson && <YouTube
        videoId={getVideoId(props.lesson.videoUrl)}
        opts={{
          width: size.width, // 75% of the viewport height
          height: size.height, // 100% of the viewport width
          playerVars: {
            autoplay: props.autoPlay ? 1 : 0,
            controls: 1,
            rel: 0,
            showinfo: 0,
          },
        }}
        onReady={(event) => {
          if (props.autoPlay) {
            event.target?.playVideo()
          }
        }}
        onEnd={() => {
          props.onVideoEnd?.()
        }}
      />}
    </div>
  )
}