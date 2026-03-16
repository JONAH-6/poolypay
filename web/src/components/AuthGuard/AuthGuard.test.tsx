import { render } from '@redwoodjs/testing/web'

import AuthGuard from './AuthGuard'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('AuthGuard', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<AuthGuard />)
    }).not.toThrow()
  })
})
