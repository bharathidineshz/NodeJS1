// ** Third Party Imports
import axios from 'axios'
import ProjectDetails from 'src/views/projects/ProjectDetails'

// ** Demo Components Imports

const ProjectDetailsTab = ({ tab, data }) => {
  return <ProjectDetails tab={tab} data={data} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'task' } },
      { params: { tab: 'milestone' } },
      { params: { tab: 'feedback' } },
      { params: { tab: 'members' } },
      { params: { tab: 'settings' } },
      { params: { tab: 'files' } }
    ],
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      tab: params?.tab
    }
  }
}

export default ProjectDetailsTab
