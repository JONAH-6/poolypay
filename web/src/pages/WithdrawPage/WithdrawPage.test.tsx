import { render } from '@redwoodjs/testing/web'

import WithdrawPage from './WithdrawPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('WithdrawPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<WithdrawPage />)
    }).not.toThrow()
  })
})
