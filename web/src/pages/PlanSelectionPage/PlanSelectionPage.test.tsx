import { render } from '@redwoodjs/testing/web'

import PlanSelectionPage from './PlanSelectionPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('PlanSelectionPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PlanSelectionPage />)
    }).not.toThrow()
  })
})
