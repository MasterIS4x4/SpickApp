import { Lesson, Word } from "../model/lesson";
import { useEffect, useState } from "react";
import { IonButton, IonContent, IonPage, IonText, IonGrid, IonRow, IonCol, IonImg } from '@ionic/react';

interface SelectWordLessonProps {
    lesson: Lesson;
    onComplete?: () => void;
    // TODO: returns result of quiz
    // TODO: limit number of words in this
}

export const SelectWordLesson = ({ lesson, onComplete }: SelectWordLessonProps) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [shuffledOptions, setShuffledOptions] = useState<Word[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [correct, setCorrect] = useState<boolean | null>(null);

    useEffect(() => {
        if (lesson.words.length > 0) {
            shuffleOptions();
        }
    }, [currentWordIndex, lesson.words]);

    const shuffleOptions = () => {
        const options = [...lesson.words]
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        if (!options.find(o => o.id === currentWord.id)) {
            options[Math.floor(Math.random() * options.length)] = currentWord;
        }

        setShuffledOptions(options.sort(() => 0.5 - Math.random()));
    };

    const handleSelect = (word: Word) => {
        setSelected(word.id);
        const isCorrect = word.id === currentWord.id;
        setCorrect(isCorrect);

        setTimeout(() => {
            if (currentWordIndex + 1 < lesson.words.length) {
                setCurrentWordIndex(currentWordIndex + 1);
                setSelected(null);
                setCorrect(null);
            } else {
                onComplete?.();
            }
        }, 1000);
    };

    const currentWord = lesson.words[currentWordIndex];

    const getImageUrl = (imageUrl: string | string[]) => {
        if (Array.isArray(imageUrl)) {
            return imageUrl.length > 0 ? imageUrl[0] : null;
        }
        return imageUrl;
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <IonText>
                    Select the correct Romanian translation:
                </IonText>
                <IonText className="ion-text-center">
                    <h1>{currentWord.nameEN}</h1>
                </IonText>

                {currentWord.imageUrl && getImageUrl(currentWord.imageUrl) && (
                    <div className="ion-text-center ion-padding">
                        <IonImg src={getImageUrl(currentWord.imageUrl)!} style={{ maxWidth: '200px', margin: '0 auto' }} />
                    </div>
                )}

                <IonGrid>
                    <IonRow>
                        {shuffledOptions.map((word) => (
                            <IonCol size="12" key={word.id}>
                                <IonButton
                                    expand="block"
                                    color={
                                        selected === word.id
                                            ? correct
                                                ? "success"
                                                : "danger"
                                            : "medium"
                                    }
                                    onClick={() => handleSelect(word)}
                                    disabled={selected !== null}
                                >
                                    {word.nameRO}
                                </IonButton>
                            </IonCol>
                        ))}
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};