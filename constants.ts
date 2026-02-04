
import { UnitData, Question, GlossaryTerm, CaseStudy } from './types';

export const COURSE_GENERAL = {
  name: "علم النفس الدينامي ونظريات القياس",
  code: "PSY 211",
  university: "جامعة العريش",
  faculty: "كلية الآداب - قسم علم النفس",
  level: "المستوى الأول / الثاني",
  hours: "3 نظري + 1 عملي",
  coordinator: "د. أحمد حمدي عاشور الغول",
  generalObjectives: [
    "فهم السلوك الإنساني كنشاط كلي غائي يهدف للتكيف مع البيئة الصحراوية والساحلية في سيناء.",
    "التمييز بين المدارس النفسية الكبرى وتطورها التاريخي من البنيوية إلى التحليل النفسي المعاصر.",
    "إتقان مناهج البحث العلمي (تجريبي، عيادي، وصفي) وتطبيقاتها في مجتمع العريش وبئر العبد.",
    "تحليل الدوافع والانفعالات الإنسانية وتأثير الضغوط الأمنية والاقتصادية على الصحة النفسية.",
    "إتقان مبادئ القياس النفسي وبناء الاختبارات التي تراعي الخصوصية الثقافية للمجتمعات القبلية.",
    "تطوير مهارات التكيف النفسي وآليات الدفاع في مواجهة الأزمات المجتمعية."
  ],
  grading: {
    midterm: 20,
    final: 60,
    participation: 10,
    reports: 10
  },
  references: [
    "أحمد عزت راجح: أصول علم النفس (دار المعارف)",
    "سيجموند فرويد: مقدمة في التحليل النفسي (ترجمة محمد عثمان نجاتي)",
    "أبراهام ماسلو: الدافعية والشخصية",
    "سيجموند فرويد: موجز التحليل النفسي"
  ]
};

export const UNITS = [
  { id: 1, title: "المدخل إلى علم النفس ومناهجه", description: "تعريف العلم، تطوره التاريخي، مدارسه الكبرى، ومناهجه التطبيقية في البيئة السيناوية." },
  { id: 2, title: "دوافع السلوك والانفعالات في السياق المحلي", description: "تحليل محركات السلوك، هرم ماسلو، وانفعالات الخوف والقلق تحت الضغوط." },
  { id: 3, title: "العمليات المعرفية والتعلم", description: "دراسة الإدراك، الانتباه، الذاكرة، ونظريات التعلم (بافلوف، ثورندايك، سكينر)." },
  { id: 4, title: "الشخصية والتكيف النفسي", description: "بناء الشخصية، آليات الدفاع اللاشعورية، ومعايير السواء واللاسواء في المجتمع القبلي." },
  { id: 5, title: "نظريات القياس في علم النفس الدينامي", description: "الصدق، الثبات، اختبارات الذكاء، والاختبارات الإسقاطية وتطبيقها ميدانياً." }
];

const createGlossary = (unitId: number): GlossaryTerm[] => {
  const allTerms: Record<number, GlossaryTerm[]> = {
    1: [
      {
        termAr: "علم النفس", termEn: "Psychology",
        definition: "الدراسة العلمية للسلوك رداً على مختلف المثيرات.",
        theory: "استقل عن الفلسفة مع ووندت 1879. يركز راجح على شمولية السلوك كنشاط كلي.",
        sinaiExample: "دراسة انفعالات طلاب العريش وقت سماع أصوات الرياح العاتية في الصحراء.",
        impact: "تحسين الوعي الذاتي والتحكم في ردود الفعل الفجائية.",
        application: "ورش عمل 'اعرف نفسك' للطلاب الجدد بمركز الشباب بالعريش."
      }
    ],
    2: [
      {
        termAr: "الدافع", termEn: "Motive",
        definition: "حالة داخلية تثير السلوك وتوجهه نحو هدف معين.",
        theory: "الدافعية هي محرك السلوك (Drive). تفرق بين الدوافع الفطرية والمكتسبة.",
        sinaiExample: "إصرار طالب من 'نخل' على المذاكرة في ظروف صعبة لتحقيق حلم التخرج.",
        impact: "زيادة المثابرة وتحمل المشاق.",
        application: "تطبيقات 'تحديد الأهداف' لمساعدة الطلاب."
      }
    ],
    3: [
      {
        termAr: "الإغلاق", termEn: "Closure",
        definition: "ميل الفرد لإدراك المثيرات غير المكتملة كأشكال كاملة.",
        theory: "قانون من قوانين مدرسة الجشطلت للتنظيم الإدراكي.",
        sinaiExample: "إدراك شكل الجمل البعيد في الصحراء رغم الغبار.",
        impact: "سرعة التفسير البيئي للمواقف الغامضة.",
        application: "تطوير مهارات القراءة السريعة."
      }
    ],
    4: [
      {
        termAr: "الإسقاط", termEn: "Projection",
        definition: "حيلة دفاعية ينسب فيها الفرد عيوبه أو رغباته للآخرين.",
        theory: "ميكانيزم دفاعي لاشعوري عند سيجموند فرويد لحماية الأنا.",
        sinaiExample: "طالب فاشل يتهم زملاءه بالكسل وإهمال المذاكرة.",
        impact: "تجنب الشعور بالذنب بشكل مؤقت.",
        application: "الإرشاد النفسي لمواجهة الحقيقة."
      }
    ],
    5: [
      {
        termAr: "الصدق", termEn: "Validity",
        definition: "مدى قدرة الاختبار على قياس ما وضع لقياسه فعلاً.",
        theory: "أهم شرط في الاختبار النفسي الجيد؛ يضمن عدالة القياس.",
        sinaiExample: "اختبار ذكاء يقيس القدرات العقلية للطلاب السيناويين فعلاً.",
        impact: "دقة التشخيص النفسي والتربوي.",
        application: "بناء اختبارات تحصيلية دقيقة بالجامعة."
      }
    ]
  };
  return allTerms[unitId] || [];
};

const createCases = (unitId: number): CaseStudy[] => {
  const allCases: Record<number, CaseStudy[]> = {
    1: [{
        id: "u1-c1",
        scenario: "طالب من 'نخل' يجد صعوبة في التكيف مع ضوضاء مدينة العريش وازدحام الجامعة. يصف لزميله إحساساً بـ 'الغربة الداخلية'.",
        questions: ["ما المنهج النفسي المناسب لدراسة حالته؟"],
        targetSkill: "التحليل المنهجي للسلوك",
        expertAnalysis: {
          theory: "المنهج المطلوب هو 'الاستبطان' التابع للمدرسة البنيوية.",
          sinaiInsight: "التحول البيئي يتطلب إعادة تنظيم إدراكي.",
          practicalSolution: "تطبيق تقنيات إزالة الحساسية التدريجي."
        }
    }],
    2: [{
        id: "u2-c1",
        scenario: "شاب من بئر العبد يسعى بكل قوته لافتتاح مشروع لتدوير المخلفات البيئية في مدينته رغم الإحباطات المادية.",
        questions: ["حدد نوع الدافع وفق هرم ماسلو."],
        targetSkill: "تحليل الدوافع العليا",
        expertAnalysis: {
          theory: "يتحرك الشاب بدافع 'تحقيق الذات'.",
          sinaiInsight: "التحديات البيئية تخلق دوافع ابتكارية قوية.",
          practicalSolution: "تعزيز دافع الإنجاز من خلال الدعم الاجتماعي."
        }
    }],
    3: [{
        id: "u3-c1",
        scenario: "سارة تتذكر تفاصيل رحلتها لرفح منذ 10 سنوات بدقة، بينما تنسى أحياناً ما درسته بالأمس.",
        questions: ["فسر هذا التباين في ضوء أنواع الذاكرة."],
        targetSkill: "فهم آليات الذاكرة",
        expertAnalysis: {
          theory: "رحلة رفح مخزنة في 'الذاكرة الوميضية' المرتبطة بالانفعالات.",
          sinaiInsight: "الأحداث الكبرى في سيناء تترك بصمات ذاكرة عميقة.",
          practicalSolution: "استخدام الربط الوجداني لتحسين الاسترجاع."
        }
    }],
    4: [{
        id: "u4-c1",
        scenario: "موظف ينسب فشله في الترقية لـ 'الحظ السيئ' أو 'اضطهاد المدير' بدلاً من ضعف أدائه.",
        questions: ["حدد ميكانيزم الدفاع المستخدم."],
        targetSkill: "كشف آليات التبرير",
        expertAnalysis: {
          theory: "هذا هو 'التبرير' والإسقاط لحماية احترام الذات.",
          sinaiInsight: "ضغوط العمل قد تزيد من اللجوء لهذه الحيل.",
          practicalSolution: "جلسات العلاج المعرفي لرفع مستوى المسؤولية الشخصية."
        }
    }],
    5: [{
        id: "u5-c1",
        scenario: "باحث يريد تطبيق اختبار ذكاء مترجم يتحدث عن 'المصاعد' و'إشارات المرور' على أطفال في عمق البادية.",
        questions: ["ما المشكلة التي تواجه 'صدق' هذا الاختبار؟"],
        targetSkill: "تحقيق الصدق الثقافي",
        expertAnalysis: {
          theory: "الاختبار يفتقر لـ 'الصدق الثقافي' والبيئي.",
          sinaiInsight: "الذكاء في البادية يرتبط بمهارات بيئية مختلفة.",
          practicalSolution: "تعديل الفقرات الاختبارية لتناسب الخبرة السيناوية."
        }
    }]
  };
  return allCases[unitId] || [];
};

const getWeeklyPlan = (unitId: number) => {
  const plans: Record<number, any[]> = {
    1: [
      { week: 1, topic: "موضوع علم النفس وفروعه", activity: "نقاش حول الشخصية السيناوية", localExample: "جامعة العريش" },
      { week: 2, topic: "المدارس النفسية", activity: "تجربة استبطان عملية", localExample: "وصف مشاعر الغربة" },
      { week: 3, topic: "مناهج البحث", activity: "تصميم تجربة بسيطة", localExample: "سوق الخميس بالعريش" }
    ],
    2: [
      { week: 4, topic: "دوافع السلوك", activity: "تحليل هرم ماسلو", localExample: "بئر العبد" },
      { week: 5, topic: "الانفعالات", activity: "تمارين إدارة القلق", localExample: "الشيخ زويد" }
    ],
    3: [
      { week: 6, topic: "الإدراك", activity: "تجارب الخداع البصري", localExample: "طريق القنطرة" },
      { week: 7, topic: "التعلم", activity: "برامج تعديل سلوك", localExample: "مدارس العريش" }
    ],
    4: [
      { week: 8, topic: "بناء الشخصية", activity: "تحليل صراعات الأنا", localExample: "مجتمعات البادية" },
      { week: 9, topic: "التكيف النفسي", activity: "دراسة حالات الصمود", localExample: "رفح" }
    ],
    5: [
      { week: 10, topic: "مبادئ القياس", activity: "تطبيق استبيان", localExample: "كلية الآداب" },
      { week: 11, topic: "الاختبارات الإسقاطية", activity: "تحليل قصص TAT", localExample: "عيادات العريش" }
    ]
  };
  return plans[unitId] || [];
};

const getObjectives = (unitId: number) => {
  const objs: Record<number, string[]> = {
    1: ["تحليل مدارس علم النفس", "إتقان البحث الميداني", "فهم السلوك الغائي"],
    2: ["فهم الدوافع", "إدارة ضغوط الحياة", "تطبيق هرم ماسلو"],
    3: ["شرح قوانين الإدراك", "تطبيق نظريات التعلم", "فهم الذاكرة"],
    4: ["كشف آليات الدفاع", "تحليل الصراعات", "تطوير التكيف"],
    5: ["حساب الصدق والثبات", "تطبيق مقاييس الذكاء", "أخلاقيات القياس"]
  };
  return objs[unitId] || [];
};

export const UNIT_1_DATA: UnitData = {
  id: 1, title: UNITS[0].title, objectives: getObjectives(1), weeklyPlan: getWeeklyPlan(1),
  glossary: createGlossary(1), questions: [], scenarioMCQs: [], cases: createCases(1),
  assessment: [{ method: "ميدتيرم", weight: 20 }]
};

export const UNIT_2_DATA: UnitData = {
  id: 2, title: UNITS[1].title, objectives: getObjectives(2), weeklyPlan: getWeeklyPlan(2),
  glossary: createGlossary(2), questions: [], scenarioMCQs: [], cases: createCases(2),
  assessment: [{ method: "تقرير", weight: 10 }]
};

export const UNIT_3_DATA: UnitData = {
  id: 3, title: UNITS[2].title, objectives: getObjectives(3), weeklyPlan: getWeeklyPlan(3),
  glossary: createGlossary(3), questions: [], scenarioMCQs: [], cases: createCases(3),
  assessment: [{ method: "عملي", weight: 10 }]
};

export const UNIT_4_DATA: UnitData = {
  id: 4, title: UNITS[3].title, objectives: getObjectives(4), weeklyPlan: getWeeklyPlan(4),
  glossary: createGlossary(4), questions: [], scenarioMCQs: [], cases: createCases(4),
  assessment: [{ method: "مشاركة", weight: 10 }]
};

export const UNIT_5_DATA: UnitData = {
  id: 5, title: UNITS[4].title, objectives: getObjectives(5), weeklyPlan: getWeeklyPlan(5),
  glossary: createGlossary(5), questions: [], scenarioMCQs: [], cases: createCases(5),
  assessment: [{ method: "نهائي", weight: 60 }]
};
