export type StoryBlankKind = 'word' | 'sentence';

export interface StoryBlank {
  blankId: string;
  kind: StoryBlankKind;
  correctText: string;
  clueTitle: string;
  /** Percentage coordinates (0-100) inside the 2D scene for placing the collectible scrap */
  clueX: number;
  clueY: number;
}

export interface StoryChoice {
  choiceId: string;
  kind: StoryBlankKind;
  text: string;
}

export type StorySegment =
  | { type: 'text'; value: string }
  | { type: 'blank'; blankId: string };

export interface StorySceneData {
  id: number;
  slug: 'iavnana' | 'erekle' | 'friends';
  title: string;
  sourceWork: string;
  instruction: string;
  moral: string;
  segments: StorySegment[];
  blanks: StoryBlank[];
  choices: StoryChoice[];
}

export const GOGEBASHVILI_STORIES: StorySceneData[] = [
  {
    id: 1,
    slug: 'iavnana',
    title: 'იავნანამ რა ჰქნა?',
    sourceWork: 'მოთხრობა · 1890 წ.',
    instruction:
      'სცენაში იპოვე 3 დაკარგული ხელნაწერის ნაგლეჯი და ჩასვი გამოტოვებული სიტყვები და წინადადება.',
    moral:
      '„მშობლიურმა სიმღერამ და სიტყვამ ადამიანის სულში მიძინებული სამშობლო გააცოცხლა.“',
    segments: [
      { type: 'text', value: 'კახეთში, ვაშლოვანის მყუდრო ეზოში, პატარა ქეთოს დედის ტკბილი ' },
      { type: 'blank', blankId: 'iav-1' },
      { type: 'text', value: ' ესმოდა აკვანთან. წლების შემდეგ, შორეულ მხარეში გატაცებულ გოგონას სწორედ ამ ჰანგმა გაახსენა მშობლიური ' },
      { type: 'blank', blankId: 'iav-2' },
      { type: 'text', value: ' და ოჯახის სითბო. ' },
      { type: 'blank', blankId: 'iav-3' },
    ],
    blanks: [
      {
        blankId: 'iav-1',
        kind: 'word',
        correctText: 'იავნანა',
        clueTitle: 'ნაგლეჯი აკვანთან',
        clueX: 25,
        clueY: 72,
      },
      {
        blankId: 'iav-2',
        kind: 'word',
        correctText: 'სამშობლო',
        clueTitle: 'ნაგლეჯი ვაზის ქვეშ',
        clueX: 74,
        clueY: 42,
      },
      {
        blankId: 'iav-3',
        kind: 'sentence',
        correctText: 'დედის სიმღერამ ქეთოს ბავშვობის მოგონებები და მშობლები დაუბრუნა.',
        clueTitle: 'ნაგლეჯი ბროწეულის ხეზე',
        clueX: 52,
        clueY: 22,
      },
    ],
    choices: [
      { choiceId: 'iav-c1', kind: 'word', text: 'სამშობლო' },
      { choiceId: 'iav-c2', kind: 'word', text: 'ქარიშხალი' },
      { choiceId: 'iav-c3', kind: 'word', text: 'იავნანა' },
      {
        choiceId: 'iav-c4',
        kind: 'sentence',
        text: 'დედის სიმღერამ ქეთოს ბავშვობის მოგონებები და მშობლები დაუბრუნა.',
      },
      {
        choiceId: 'iav-c5',
        kind: 'sentence',
        text: 'ქეთომ სამუდამოდ დაივიწყა თავისი მშობლიური ენა და კუთხე.',
      },
    ],
  },
  {
    id: 2,
    slug: 'erekle',
    title: 'ერეკლე მეფე და ინგილო ქალი',
    sourceWork: '„ბუნების კარი“ · ისტორიული ამბავი',
    instruction:
      'იპოვე ხიდსა და ალაზნის ველზე გაფანტული ნაგლეჯები და აღადგინე დაზიანებული აბზაცი.',
    moral:
      '„სიმართლე და ერის ღირსების დაცვა უბრალო ადამიანსაც მეფის თანასწორად აქცევს.“',
    segments: [
      { type: 'text', value: 'ერთხელ მეფე ' },
      { type: 'blank', blankId: 'ere-1' },
      { type: 'text', value: ' ამალასთან ერთად კახეთის გზაზე მიდიოდა და მდინარის პირას პატარა ინგილო გოგონას შეხვდა. გოგონამ მეფეს უშიშრად და ' },
      { type: 'blank', blankId: 'ere-2' },
      { type: 'text', value: ' გაუბა საუბარი სამშობლოს ბედზე. ' },
      { type: 'blank', blankId: 'ere-3' },
    ],
    blanks: [
      {
        blankId: 'ere-1',
        kind: 'word',
        correctText: 'ერეკლე',
        clueTitle: 'ნაგლეჯი ქვის ხიდზე',
        clueX: 30,
        clueY: 66,
      },
      {
        blankId: 'ere-2',
        kind: 'word',
        correctText: 'გულადობით',
        clueTitle: 'ნაგლეჯი წყლის პირას',
        clueX: 76,
        clueY: 70,
      },
      {
        blankId: 'ere-3',
        kind: 'sentence',
        correctText: 'მეფე აღფრთოვანდა ქალის სიბრძნით, მადლობა გადაუხადა და უხვად დაასაჩუქრა.',
        clueTitle: 'ნაგლეჯი ციხის გალავანთან',
        clueX: 54,
        clueY: 25,
      },
    ],
    choices: [
      { choiceId: 'ere-c1', kind: 'word', text: 'გულადობით' },
      { choiceId: 'ere-c2', kind: 'word', text: 'ერეკლე' },
      { choiceId: 'ere-c3', kind: 'word', text: 'შიშით' },
      {
        choiceId: 'ere-c4',
        kind: 'sentence',
        text: 'მეფე აღფრთოვანდა ქალის სიბრძნით, მადლობა გადაუხადა და უხვად დაასაჩუქრა.',
      },
      {
        choiceId: 'ere-c5',
        kind: 'sentence',
        text: 'გოგონამ ხმა ვერ ამოიღო და უსიტყვოდ გაეცალა მდინარის ნაპირს.',
      },
    ],
  },
  {
    id: 3,
    slug: 'friends',
    title: 'ორი ამხანაგი',
    sourceWork: '„დედა ენა“ · იგავი მეგობრობაზე',
    instruction:
      'ტყის სცენაში იპოვე დაკარგული 3 ფრაგმენტი და გაასწორე იგავის გამოტოვებული ადგილები.',
    moral:
      '„ნამდვილი მეგობარი განსაცდელში არ მიგატოვებს — ჭეშმარიტი ამხანაგობა ერთგულებით იზომება.“',
    segments: [
      { type: 'text', value: 'ტყეში მიმავალ ორ ამხანაგს გზაზე მოულოდნელად დიდი ' },
      { type: 'blank', blankId: 'fri-1' },
      { type: 'text', value: ' შემოხვდა. ერთმა მეგობარმა მეორე გასაჭირში მიატოვა და სწრაფად მაღალ ' },
      { type: 'blank', blankId: 'fri-2' },
      { type: 'text', value: ' აძვრა. მეორე ბიჭი მიწაზე გაირინდა და სუნთქვა შეიკრა; როცა მხეცი წავიდა, ' },
      { type: 'blank', blankId: 'fri-3' },
    ],
    blanks: [
      {
        blankId: 'fri-1',
        kind: 'word',
        correctText: 'დათვი',
        clueTitle: 'ნაგლეჯი ბილიკზე',
        clueX: 72,
        clueY: 73,
      },
      {
        blankId: 'fri-2',
        kind: 'word',
        correctText: 'ხეზე',
        clueTitle: 'ნაგლეჯი მუხის ტოტზე',
        clueX: 26,
        clueY: 28,
      },
      {
        blankId: 'fri-3',
        kind: 'sentence',
        correctText: 'ხიდან ჩამოსულმა მეგობარმა ჰკითხა და ბიჭმა უპასუხა: დათვმა მირჩია, ცრუ ამხანაგთან აღარ იაროო.',
        clueTitle: 'ნაგლეჯი ტყის კორომში',
        clueX: 52,
        clueY: 50,
      },
    ],
    choices: [
      { choiceId: 'fri-c1', kind: 'word', text: 'ხეზე' },
      { choiceId: 'fri-c2', kind: 'word', text: 'დათვი' },
      { choiceId: 'fri-c3', kind: 'word', text: 'ნავში' },
      {
        choiceId: 'fri-c4',
        kind: 'sentence',
        text: 'ხიდან ჩამოსულმა მეგობარმა ჰკითხა და ბიჭმა უპასუხა: დათვმა მირჩია, ცრუ ამხანაგთან აღარ იაროო.',
      },
      {
        choiceId: 'fri-c5',
        kind: 'sentence',
        text: 'ორივე ამხანაგი მშვიდად დაჯდა და ტყეში სიმღერა დაიწყო.',
      },
    ],
  },
];
