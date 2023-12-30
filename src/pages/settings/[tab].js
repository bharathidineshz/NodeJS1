import axios from 'axios'
import Configuration from 'src/pages/settings'

const ConfigurationTab = ({ tab }) => {
  return <Configuration tab={tab == null ? 'Department' : tab} />
}

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { tab: 'Department' } },
      { params: { tab: 'Skills' } },
      { params: { tab: 'Settings' } }
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

export default ConfigurationTab
