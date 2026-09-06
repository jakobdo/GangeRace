import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

async function createRace() {
  vi.resetModules()
  const { useRace } = await import('./useRace')
  return useRace()
}

function completeRace(
  race: Awaited<ReturnType<typeof createRace>>,
  incorrectIds: string[] = [],
) {
  const seenIds: string[] = []
  while (!race.hasFinished.value) {
    const exercise = race.currentExercise.value
    seenIds.push(exercise.id)
    const answer = exercise.left * exercise.right + (incorrectIds.includes(exercise.id) ? 1 : 0)
    race.submitAnswer(answer)
  }
  return seenIds
}

describe('useRace', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('selects a short race from the full set of tables before shuffling it', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const race = await createRace()

    race.startRace(10)
    const questionIds = completeRace(race)

    expect(questionIds).toHaveLength(10)
    expect(questionIds.some((id) => !id.startsWith('1-'))).toBe(true)
  })

  it('practices only the questions answered incorrectly', async () => {
    const race = await createRace()
    const incorrectIds = ['2-4', '4-5']

    race.startRace(100)
    completeRace(race, incorrectIds)
    race.startPracticeErrors()

    expect(completeRace(race)).toEqual(expect.arrayContaining(incorrectIds))
    expect(race.totalCount.value).toBe(2)
  })

  it('practices every question in the selected tables', async () => {
    const race = await createRace()

    race.startRace(100)
    completeRace(race)
    race.startPracticeTables([4, 5])
    const questionIds = completeRace(race)

    expect(questionIds).toHaveLength(20)
    expect(questionIds.every((id) => ['4', '5'].includes(id.split('-')[0]))).toBe(true)
  })
})