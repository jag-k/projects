import { credential } from './helpers.js';
import cliSelect from 'cli-select';

export const getResumeId = async (api) => {
  let resume_id = credential.resume_id;
  if (!resume_id) {
    let res = await api.get('/resumes/mine')
    let resumes = res.data.items.filter(elem => !elem.blocked);
    console.log("Select resume:")
    let resume = (await cliSelect({
      values: resumes,
      valueRenderer: (value, selected) => {
        let defaultValue = `"${value.title}"`
        if (selected)
          return defaultValue + `: ${value.last_name} ${value.first_name} ${value.middle_name}, ${value.area.name}, ${value.status.name}`;
        return defaultValue;
      },
      selected: '  (x)',
      unselected: '  ( )',
    })).value
    resume_id = resume.id
    credential._data.resume_id = resume.id;
    credential.save();
  }
  return resume_id;
}
