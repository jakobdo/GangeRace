import { computed, ref } from 'vue'

export type Exercise = {
  id: string
  left: number
  right: number
  answer: string
  isCorrect: boolean | null
}

const exercises = ref<Exercise[]>([])
const currentIndex = ref(0)
const hasStarted = ref(false)
const hasFinished = ref(false)
const elapsedSeconds = ref(0)
let timerId: number | undefined

function allExercises(): Exercise[] {
  return Array.from({ length: 10 }, (_, leftIndex) =>
    Array.from({ length: 10 }, (_, rightIndex) => ({
      id: `${leftIndex + 1}-${rightIndex + 1}`,
      left: leftIndex + 1,
      right: rightIndex + 1,
      answer: '',
      isCorrect: null,
    })),
  ).flat()
}

function shuffle(exercisesToShuffle: Exercise[]) {
  const shuffled = [...exercisesToShuffle]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }
  return shuffled
}

export function useRace() {
  const currentExercise = computed(() => exercises.value[currentIndex.value])
  const totalCount = computed(() => exercises.value.length)
  const correctCount = computed(() => exercises.value.filter(({ isCorrect }) => isCorrect === true).length)
  const accuracy = computed(() => (exercises.value.length ? Math.round((correctCount.value / exercises.value.length) * 100) : 0))
  const formattedTime = computed(() => {
    const minutes = Math.floor(elapsedSeconds.value / 60)
    const seconds = elapsedSeconds.value % 60
    return `${minutes}:${String(seconds).padStart(2, '0')}`
  })
  const formattedAverageTime = computed(() => {
    if (!totalCount.value) return '0'
    return (elapsedSeconds.value / totalCount.value).toFixed(1).replace('.0', '')
  })
  const tableStats = computed(() =>
    Array.from({ length: 10 }, (_, index) => {
      const table = index + 1
      const tableExercises = exercises.value.filter((exercise) => exercise.left === table)
      const wrong = tableExercises.filter((exercise) => exercise.isCorrect === false).length
      const correct = tableExercises.filter((exercise) => exercise.isCorrect === true).length
      return { table, wrong, correct }
    }).filter(({ wrong }) => wrong > 0),
  )
  const weakestTable = computed(() =>
    tableStats.value.length ? [...tableStats.value].sort((first, second) => second.wrong - first.wrong)[0] : null,
  )

  function startExercises(nextExercises: Exercise[]) {
    if (!nextExercises.length) return
    exercises.value = shuffle(nextExercises)
    currentIndex.value = 0
    elapsedSeconds.value = 0
    hasStarted.value = true
    hasFinished.value = false
    window.clearInterval(timerId)
    timerId = window.setInterval(() => {
      elapsedSeconds.value += 1
    }, 1000)
  }

  function startRace(questionCount = 100) {
    const safeQuestionCount = Math.max(1, Math.min(100, Math.floor(questionCount)))
    startExercises(shuffle(allExercises()).slice(0, safeQuestionCount))
  }

  function startPracticeErrors() {
    startExercises(
      exercises.value
        .filter((exercise) => exercise.isCorrect === false)
        .map(({ id, left, right }) => ({ id, left, right, answer: '', isCorrect: null })),
    )
  }

  function startPracticeTables(tables: number[]) {
    startExercises(allExercises().filter((exercise) => tables.includes(exercise.left)))
  }

  function submitAnswer(answer: string | number | null) {
    const exercise = currentExercise.value
    const answerText = answer === null ? '' : String(answer)
    const numericAnswer = Number(answerText)
    if (!exercise || answerText.trim() === '' || !Number.isInteger(numericAnswer) || numericAnswer < 1) return false

    exercise.answer = answerText
    exercise.isCorrect = numericAnswer === exercise.left * exercise.right
    if (currentIndex.value === exercises.value.length - 1) {
      hasFinished.value = true
      window.clearInterval(timerId)
      return true
    }

    currentIndex.value += 1
    return false
  }

  function getErrorsForTable(table: number) {
    return exercises.value
      .filter((exercise) => exercise.left === table && exercise.isCorrect === false)
      .sort((first, second) => first.right - second.right)
  }

  return {
    currentExercise,
    currentIndex,
    totalCount,
    hasStarted,
    hasFinished,
    formattedTime,
    formattedAverageTime,
    correctCount,
    accuracy,
    tableStats,
    weakestTable,
    startRace,
    startPracticeErrors,
    startPracticeTables,
    submitAnswer,
    getErrorsForTable,
  }
}