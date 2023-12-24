// ** Third Party Imports
import axios from 'axios'
import { useSelector } from 'react-redux'
import ProjectDetails from 'src/views/projects/ProjectDetails'

// ** Demo Components Imports

const ProjectDetailsTab = ({ tab, data }) => {
  const store = useSelector(state=> state.projects)
  const project = store?.selectedProject == null ? localStorage.getItem("projectId") : store.selectedProject;

  return <ProjectDetails tab={tab} project={project || []} data={[]} />
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
