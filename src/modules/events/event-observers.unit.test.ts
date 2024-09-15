import { describe, it } from 'node:test'
import { expect } from 'expect'
import { EventObservers } from './event-observers.js'

describe('Event observers unit test', () => {
  it('returns an observer on a single subject', () => {
    const observers = new EventObservers()

    observers.addObserver('first', async () => {})
    observers.addObserver('second', async () => {})

    expect(observers.getObservers('first')).toHaveLength(1)
    expect(observers.getObservers('second')).toHaveLength(1)
  })

  it('returns an observer on two subjects', () => {
    const observers = new EventObservers()

    observers.addObserver('a.b', async () => {})
    observers.addObserver('a.c', async () => {})
    observers.addObserver('b.b', async () => {})

    expect(observers.getObservers('a.b')).toHaveLength(1)
    expect(observers.getObservers('a.c')).toHaveLength(1)
    expect(observers.getObservers('b.b')).toHaveLength(1)
  })

  it('returns all observers for a single subject wildcard', () => {
    const observers = new EventObservers()

    observers.addObserver('*', async () => {})
    observers.addObserver('a', async () => {})
    observers.addObserver('b', async () => {})

    expect(observers.getObservers('a')).toHaveLength(2)
    expect(observers.getObservers('b')).toHaveLength(2)
    expect(observers.getObservers('c')).toHaveLength(1)
  })

  it('does not return observers whose topic ends earlier or later', () => {
    const observers = new EventObservers()

    observers.addObserver('a', async () => {})
    observers.addObserver('a.b', async () => {})
    observers.addObserver('a.b.c', async () => {})

    expect(observers.getObservers('a')).toHaveLength(1)
    expect(observers.getObservers('a.b')).toHaveLength(1)
    expect(observers.getObservers('a.b.c')).toHaveLength(1)
  })

  it('returns all observers for a single subject wildcard', () => {
    const observers = new EventObservers()

    observers.addObserver('*.a', async () => {})
    observers.addObserver('a.a', async () => {})
    observers.addObserver('b.a', async () => {})

    expect(observers.getObservers('a.a')).toHaveLength(2)
    expect(observers.getObservers('b.a')).toHaveLength(2)
    expect(observers.getObservers('c.a')).toHaveLength(1)
    expect(observers.getObservers('c.b')).toHaveLength(0)
  })
})
