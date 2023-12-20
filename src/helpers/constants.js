import { formatLocalDate } from './dateFormats'

export const SKILLS = [
  { name: 'Angular' },
  { name: 'Asp.Net' },
  { name: 'Azure' },
  { name: 'Javascript' },
  { name: 'Flutter' },
  { name: 'Figma' },
  { name: 'Python' },
  { name: 'SQL' },
  { name: 'Sharepoint' },
  { name: 'React' }
]

export const ORG_UNITS = [{ name: 'Marketing' }, ...SKILLS]

export const CATEGORIES = ['Leave Management', 'Tasks', 'Milestone']

export const roles = {
  1: { name: 'Admin', icon: 'mdi:laptop', color: 'error.main' },
  2: { name: 'Management', icon: 'mdi:cog-outline', color: 'warning.main' },
  3: { name: 'Operations', icon: 'mdi:pencil-outline', color: 'info.main' },
  4: { name: 'User', icon: 'mdi:account-outline', color: 'primary.main' }
}

export const TASk_LIST = [
  {
    id: 1,
    task: 'Create Leave Managament',
    status: 'Completed',
    owner: 'Dhineshkumar Selvam',
    estimatedHours: 10,
    dueDate: formatLocalDate(new Date()),
    isBillable: false
  },
  {
    id: 2,
    task: 'Create Tasks Page',
    status: 'Not Started',
    estimatedHours: 15,
    owner: 'Naveenkumar Mounasamy',
    dueDate: formatLocalDate(new Date()),
    isBillable: false
  },
  {
    id: 3,
    task: 'Enhance the Table View for Tasks',
    status: 'Working on it',
    owner: 'Pavithra Murugesan',
    estimatedHours: 20,
    dueDate: formatLocalDate(new Date()),
    isBillable: false
  },
  {
    id: 4,
    task: 'API Inetegrations',
    status: 'Working on it',
    owner: 'Babysha Papanasam',
    estimatedHours: 25,
    dueDate: formatLocalDate(new Date()),
    isBillable: false
  },
  {
    id: 5,
    task: 'Product Launch',
    status: 'Due',
    owner: 'Mukesh Sekar',
    estimatedHours: 30,
    dueDate: formatLocalDate(new Date()),
    isBillable: false
  }
]

export const PROJECT_MEMBERS = [
  {
    fullName: 'NaveenKumar Mounasamy',
    email: 'naveen.mounasamy@leanprofit.ai',
    role: 'Software Engineer',
    skills: ['Asp.Net Core', 'SQL', 'Angular'],
    feedbacks: 6,
    tasks: 428,
    utilization: '30%'
  },
  {
    fullName: 'Chanakya Jayabalan',
    email: 'chanakya.b@leanprofit.ai',
    role: 'Founder & CEO of Athen',
    skills: ['Sharepoint'],
    feedbacks: 310,
    tasks: 50,
    utilization: '70%'
  },
  {
    fullName: 'BabySha Papanasam',
    email: 'babysha.papanasam@leanprofit.ai',
    role: 'Junior Software Engineer',
    skills: ['Asp.Net Core', 'SQL', 'React-Js'],
    feedbacks: 2,
    tasks: 35,
    utilization: '50%'
  },
  {
    fullName: 'Dhivya Kumarasamy',
    email: 'dhivya.kumarasamy@leanprofit.ai',
    role: 'Team Lead',
    skills: ['Asp.Net Core', 'SQL', 'Azure', 'Power Automate'],
    feedbacks: 23,
    tasks: 579,
    utilization: '90%'
  },
  {
    fullName: 'Pavithra Murugesan',
    email: 'pavithra.murugesan@leanprofit.ai',
    role: 'Senior Software Engineer',
    skills: ['Sharepoint', 'React', 'SQL', 'Power Automate'],
    feedbacks: 18,
    tasks: 218,
    utilization: '60%'
  }
]

export const FEEDBACKS = [
  {
    title: 'An employee who doesn’t hold to their commitments on group or team projects.',
    description:
      'I noticed I asked you for a deliverable on this key project by the end of last week. I still haven’t received this deliverable and wanted to follow up. If a deadline doesn’t work well with your bandwidth, would you be able to check in with me? I’d love to get a good idea of what you can commit to without overloading your workload.',
    member: 'Naveenkumar Mounasamy',
    rating: 4
  },
  {
    title: 'A direct report who struggles to meet deadlines.',
    description:
      'hanks for letting me know you’re running behind schedule and need an extension. I’ve noticed this is the third time you’ve asked for an extension in the past two weeks. In our next one-on-one, can you come up with a list of projects and the amount of time that you’re spending on each project? I wonder if we can see how you’re managing your time and identify efficiencies.',
    member: 'Pavithra Murugesan',
    rating: 3
  },
  {
    title: 'Improve customer service skills.',
    description:
      'Always try to exhibit creativity and flexibility in solving customers’ problems and questions.Try to address problems as quickly as possible even if it’s a demanding customer.',
    member: 'Babysha Papanasam',
    rating: 2
  },
  {
    title: 'Give time and space for clarifying questions.',
    description:
      'Constructive feedback can be hard to hear. It can also take some time to process. Make sure you give the person the time and space for questions and follow-up. ',
    member: 'Dhivya Kumarasamy',
    rating: 1
  }
]
