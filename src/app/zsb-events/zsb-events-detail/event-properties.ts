export interface Property {
  name: string,
  formControlName: string,
  type: string,
  showChildren?: boolean,
  properties?: Property[]
}
export const atSchoolProperty: Property = {
  name: 'An Schule',
  formControlName: 'atSchool',
  type: 'checkbox',
  properties: [
    {
      name: 'KAoA',
      formControlName: 'kaoa',
      type: 'toggle',
      showChildren: false,
      properties: [
        {
          name: 'Last Minute Information',
          formControlName: 'lastMinuteInformation',
          type: 'checkbox',
        },
        {
          name: 'Vortrag Allgemeine Studienorientierung',
          formControlName: 'generalStuOri',
          type: 'checkbox',
          properties: [
            {
              name: 'Durchläufe',
              formControlName: 'runsStuOri',
              type: 'integer',
            }
          ]
        },
        {
          name: 'Schuljahresendgespräch',
          formControlName: 'endMeeting',
          type: 'checkbox',
        },
        {
          name: 'Schuljahresplanungsgespräch',
          formControlName: 'planMeeting',
          type: 'checkbox',
        },
        {
          name: 'Sonstiges',
          formControlName: 'kaoaOther',
          type: 'checkbox',
          properties: [
            {
              name: 'Freitext',
              formControlName: 'kaoaOtherText',
              type: 'text',
            }
          ]
        }
      ]
    },
    {
      name: 'Talentscouting',
      formControlName: 'talentScouting',
      type: 'toggle',
      showChildren: false,
      properties: [
        {
          name: 'Gespräch',
          formControlName: 'meeting',
          type: 'checkbox',
        },
        {
          name: 'Scouting',
          formControlName: 'scouting',
          type: 'checkbox',
        },
        {
          name: 'Sonstiges',
          formControlName: 'tsOther',
          type: 'checkbox',
          properties: [
            {
              name: 'Freitext',
              formControlName: 'tsOtherText',
              type: 'text',
            },
          ]
        },
      ],
    },
    {
      name: 'TH-Spezifisch',
      formControlName: 'thSpecific',
      type: 'toggle',
      showChildren: false,
      properties: [
        {
          name: 'Einzeltermin',
          formControlName: 'singleAppt',
          type: 'checkbox',
          properties: [
            {
              name: 'Beratung',
              formControlName: 'singleConsulting',
              type: 'checkbox',
            },
            {
              name: 'Fachvortrag',
              formControlName: 'singlePresentation',
              type: 'checkbox',
            },
            {
              name: 'Vortrag "Technology, Arts, Sciences"',
              formControlName: 'singlePresentationTh',
              type: 'checkbox',
              properties: [
                {
                  name: 'Durchläufe',
                  formControlName: 'singleRunsPresentation',
                  type: 'integer',
                }
              ]
            },
            {
              name: 'Informationsstand',
              formControlName: 'singleInformation',
              type: 'checkbox',
            },
            {
              name: 'Sonstiges',
              formControlName: 'singleOther',
              type: 'checkbox',
              properties: [
                {
                  name: 'Freitext',
                  formControlName: 'singleOtherText',
                  type: 'text',
                }
              ]
            },
          ]
        },
        {
          name: 'Schulmesse',
          formControlName: 'schoolFair',
          type: 'checkbox',
          properties: [
            {
              name: 'Beratung',
              formControlName: 'fairConsulting',
              type: 'checkbox',
            },
            {
              name: 'Fachvortrag',
              formControlName: 'fairPresentation',
              type: 'checkbox',
            },
            {
              name: 'Vortrag "Technology, Arts, Sciences"',
              formControlName: 'fairPresentationTh',
              type: 'checkbox',
              properties: [
                {
                  name: 'Durchläufe',
                  formControlName: 'fairRunsPresentation',
                  type: 'integer',
                }
              ]
            },
            {
              name: 'Informationsstand',
              formControlName: 'fairInformation',
              type: 'checkbox',
            },
            {
              name: 'Sonstiges',
              formControlName: 'fairOther',
              type: 'checkbox',
              properties: [
                {
                  name: 'Freitext',
                  formControlName: 'fairOtherText',
                  type: 'text',
                }
              ]
            },
          ]
        }
      ]
    }
  ]
}
export const internProperty: Property = {
  name: 'Bei Uns',
  formControlName: 'intern',
  type: 'checkbox',
  properties: [
    {
      name: 'Campustag(e)',
      formControlName: 'campusDays',
      type: 'checkbox'
    },
    {
      name: 'Schülerlabor',
      formControlName: 'studentLab',
      type: 'checkbox'
    },
    {
      name: 'Sonstiges',
      formControlName: 'internOther',
      type: 'checkbox',
      properties: [
        {
          name: 'Freitext',
          formControlName: 'internOtherText',
          type: 'text'
        }
      ]
    },
  ]
}
