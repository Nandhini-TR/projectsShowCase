import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    status: apiStatusConstants.initial,
    projectList: [],
    category: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProject()
  }

  getProject = async () => {
    const {category} = this.state

    console.log(category)

    this.setState({status: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const response = await fetch(apiUrl)

    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))

      this.setState({
        projectList: updatedData,
        status: apiStatusConstants.success,
      })
    } else {
      this.setState({status: apiStatusConstants.failure})
    }
  }

  onClickCategory = event => {
    this.setState({category: event.target.value}, this.getProject)
  }

  renderinProgress = () => (
    <div data-testid="loader" className="project-list-container">
      <Loader type="TailSpin" width={50} height={50} />
    </div>
  )

  renderFailure = () => (
    <div className="project-list-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.getProject}>
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {projectList} = this.state

    return (
      <ul className="project-ul-list-container">
        {projectList.map(eachProject => (
          <li key={eachProject.id} className="project-list">
            <img
              src={eachProject.imageUrl}
              alt={eachProject.name}
              className="project-image-name"
            />
            <p className="project-name">{eachProject.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderProjects = () => {
    const {status} = this.state

    switch (status) {
      case apiStatusConstants.inProgress:
        return this.renderinProgress()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.success:
        return this.renderSuccess()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="projects-showcase-container">
          <select
            name="category"
            onChange={this.onClickCategory}
            className="box-container"
          >
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
        </div>
        {this.renderProjects()}
      </>
    )
  }
}

export default ProjectsShowcase
