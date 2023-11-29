import '../styles/styles.scss';
import '../assets/imgs/CV_image.jpeg';



document.addEventListener("DOMContentLoaded", () => {
  initialize();
});


function initialize() {
  fetch('assets/i18n/es.json').then(res => res.json()).then(manageData);
}

function manageData(data) {
  const { personal_data, about_me, experience, studies, knowledges } = data;

  setSocialData(personal_data.social);
  setPersonalData(personal_data);

  setAboutMe(about_me);
  setChronology(experience);
  setChronology(studies);
  setKnowledges(knowledges);

  listenDownloadButton(data.download_button);
}


function listenDownloadButton(buttonName) {
  const button = document.querySelector('[data-download]');
  button.textContent = buttonName;

  button.addEventListener('click', () => window.print());
}


function setPersonalData(data) {
  const dataKeys = ['name', 'surname', 'years', 'location', 'position'];
  dataKeys.forEach(key => setData(data, key));

  setData(data, 'phone', (element) => element.href = `tel:${data.phone.split(' ').join('')}`);
  setData(data, 'email', (element) => element.href = `mailto:${data.email}`);
}


function setAboutMe(aboutMe) {
  const section = createSection(aboutMe.title);

  aboutMe.information.forEach((data, index) => {
    const paragraph = createElement('p');
    const isLast = index + 1 === aboutMe.information.length;

    paragraph.classList.add(`cv-text${isLast ? '-last' : ''}`);
    paragraph.textContent = data;
    section.appendChild(paragraph);
  });
}


function setChronology(experience) {
  const section = createSection(experience.title);
  const experienceContainer = createElement('ol', 'cv-cronology');

  experience.data.forEach((data) => {
    const dataELement = createElement('li', 'cv-cronology__item');
    const dataContainer = createElement('ul', 'cv-cronology__data');

    const bullet = createElement('span', 'cv-cronology__bullet');
    const content = createElement('article', 'cv-cronology__content');
    const title = createElement('h3', 'cv-cronology__title cv-text');
    const subtitle = createElement('h4', 'cv-cronology__subtitle cv-text')
    const date = createElement('span', 'cv-cronology__date cv-text');

    title.textContent = data.title;
    subtitle.textContent = data.location;
    date.textContent = data.date;

    dataELement.appendChild(bullet);
    dataELement.appendChild(content);
    content.appendChild(title);

    if (data.location) {
      content.appendChild(subtitle);
    }

    content.appendChild(date);

    if (data.information && data.information.length) {
      content.appendChild(dataContainer);
    }

    (data.information || []).forEach(info => {
      const infoElement = createElement('li', 'cv-cronology__data-item cv-text');
      infoElement.textContent = info;
      dataContainer.appendChild(infoElement);
    });

    experienceContainer.appendChild(dataELement);
  });

  section.appendChild(experienceContainer);
}


function setKnowledges(knowledges) {
  const section = createSection(knowledges.title);
  const container = createElement('div', 'cv-badge__container');
  const { technologies } = knowledges;

  technologies.forEach(technology => {
    const badge = createElement('div', `cv-badge cv-badge--${technology.type}`);
    badge.textContent = technology.title;
    container.appendChild(badge);
  });

  section.appendChild(container);
}


function setSocialData(social) {
  const socialKeys = Object.keys(social);
  const container = document.querySelector('[data-social');

  socialKeys.forEach((key) => {
    const icon = document.createElement('i');
    icon.classList.add('cv-social__icon', 'fa-brands', `fa-${key === 'linkedin'
      ? 'linkedin-in'
      : key
      }`)

    const link = document.createElement('a');
    link.classList.add('cv-social__link');
    link.target = '_blank';
    link.href = social[key];

    link.appendChild(icon);
    container.appendChild(link);
  });

  if (!socialKeys.length) {
    container.remove();
  }
}


function setData(data, key, fn?) {
  const dataElement = document.querySelector(`[data-${key}]`);
  dataElement.textContent = data[key];

  if (!data[key]) {
    dataElement.remove();
  }

  if (fn) {
    fn(dataElement);
  }
}


function createSection(title) {
  const content = document.querySelector('[data-content]');
  const cardDiv = createElement('div', 'cv-card');
  const sectionContent = createElement('section', 'cv-card__content');
  const titleElement = createElement('h2', 'cv-text mb-4');
  const separator = createElement('span', 'separator');


  titleElement.textContent = title;
  sectionContent.appendChild(titleElement);
  sectionContent.appendChild(separator);

  cardDiv.appendChild(sectionContent);
  content.appendChild(cardDiv);

  return sectionContent;
}


function createElement(type, classList?) {
  const element = document.createElement(type);
  if (classList) {
    element.classList.add(...classList?.split(' '));
  }
  return element;
}