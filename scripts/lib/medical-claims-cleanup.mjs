// Phase 5G.2A (2026-10-12): permanent removal of unverified "guaranteed
// result" / "risk-free" / "100% success" / "always works" medical claims,
// and MCT-as-direct-provider ("we perform") corporate-identity language,
// from the 9 articles flagged P0 in the Phase 5G.2 read-only audit.
//
// Same slug-scoped, exact-match, flat-array design as
// organ-transplant-cleanup.mjs (see that file's header for why arrays, not
// slug-keyed objects, are used: a duplicate object key silently overwrites
// an earlier entry, which is exactly what caused the Phase 5G.1E
// regression). assertNoDuplicateRules() is reused from the same module so
// both files are protected by one shared check.
//
// Every replacement removes the specific unverified claim rather than
// substituting a different unverified one -- no new success rate, safety
// claim, or MCT-as-provider framing is introduced. Several replacements
// explicitly add "results/individual experience may vary" language per the
// task's requirement.

import { assertNoDuplicateRules, applySequentialRules } from "./organ-transplant-cleanup.mjs";

export const MEDICAL_CLAIMS_REPLACEMENTS = [
  {
    slug: "beard-transplant-cost-turkey",
    label: "100% success rate claim (fragmented across 3 <span> tags in source)",
    find: "<span>Beard transplant operations are generally v</span><span>ery successful. It is possible to say that the success rate is one hundred percent since it is pos</span><span>sible to compensate for the operations performed with the FUE technique. Of course, this success is valid for operations performed by expert plastic surgeons.</span>",
    replace:
      "<span>Beard transplant operations generally have high success rates, particularly when performed with the FUE technique by expert plastic surgeons. Individual results vary, and your doctor can advise on what to expect in your case.</span>",
    expectedCount: 1,
  },
  {
    slug: "frequently-asked-questins-in-botox",
    label: "'safe, risk-free and successful drug' claim",
    find: "Botox is a safe, risk-free and successful drug that can be used as an alternative to some surgeries, with highly controlled application.",
    replace:
      "Botox is generally well-tolerated with a low risk of side effects when administered by a qualified practitioner, and can be used as an alternative to some surgeries with highly controlled application.",
    expectedCount: 1,
  },
  {
    slug: "does-hair-transplant-work",
    label: "self-contradictory 'always works' / 'not a promise it will work' passage",
    find: "A hair transplant really works. Hair transplantation is a system that always works and ensures that new hair grows as soon as possible. It is not a promise or a claim that hair transplantation will work. Because there is a case that has been proven. ",
    replace:
      "Hair transplantation has a high success rate and is a well-established, medically proven procedure. Results can vary between patients, and your doctor can discuss realistic expectations for your case. ",
    expectedCount: 1,
  },
  {
    slug: "how-to-maximize-hair-transplant-results",
    label: "'always works' absolute claim",
    find: "Hair transplantation is a method that always works and allows new hair to grow. The fact that this process works is not something that is put forward as an allegation. Because it has already been proven that this application works.",
    replace:
      "Hair transplantation is a well-established, medically proven method for allowing new hair to grow, and its effectiveness is supported by extensive clinical experience.",
    expectedCount: 1,
  },
  {
    slug: "beard-transplant-in-turkey",
    label: "'risk-free surgical treatment' list item",
    find: "<li><span>It is a risk-free surgical treatment.</span></li>",
    replace: "<li><span>It has a relatively low complication rate compared to other surgical treatments.</span></li>",
    expectedCount: 1,
  },
  {
    slug: "frequently-asked-questions-in-hair-transplant",
    label: "'extremely risk-free' / 'adverse effects have not yet been noticed' claim",
    find: "This procedure is an extremely risk-free procedure performed under local anaesthesia. Health-related adverse effects have not yet been noticed in the post-procedure period.",
    replace:
      "This procedure has a relatively low complication rate and is performed under local anaesthesia. Significant health-related adverse effects are uncommon, though individual experiences may vary.",
    expectedCount: 1,
  },
  {
    slug: "liposuction-in-turkey",
    label: "'we perform' + 'there is no scar' claim (corporate identity + absolute claim)",
    find: "Since we perform liposuction from very thin entrances, there is no scar.",
    replace: "Since liposuction is performed through very small entry points, scarring is typically minimal.",
    expectedCount: 1,
  },
  {
    slug: "plastic-surgery-in-turkey",
    label: "'can guarantee that your nose will be exactly as you see it' result guarantee",
    find: "Experienced plastic surgeons in Turkey can guarantee that your nose will be exactly as you see it during the modelling phase after the process.",
    replace:
      "Experienced plastic surgeons in Turkey will work closely with you to achieve a result as close as possible to the simulation shown during the modelling phase, though individual results can vary.",
    expectedCount: 1,
  },
  {
    slug: "tummy-tuck-in-turkey",
    label: "'we can guarantee you consistent results' claim",
    find: "If you eat a healthy plant-based diet and exercise regularly, we can guarantee you consistent results and a flat, beautiful stomach.",
    replace: "If you eat a healthy plant-based diet and exercise regularly, you can help support consistent, long-lasting results.",
    expectedCount: 1,
  },
  {
    slug: "tummy-tuck-in-turkey",
    label: "'Our surgeons' corporate-identity framing",
    find: "Our surgeons are regularly screened for surgical results and patient satisfaction.",
    replace: "Partner surgeons are regularly screened for surgical results and patient satisfaction.",
    expectedCount: 1,
  },

  // Phase 5G.2A.1 (2026-10-12): the site owner reviewed the 5G.2A
  // replacement text above for 6 of the 9 articles and rejected it -- the
  // replacements still asserted unsupported claims ("high success rate",
  // "low complication rate", "medically proven") with no more backing than
  // the original text they replaced. These rules run AFTER the 5G.2A rules
  // above for the same slug (array order = application order), finding the
  // 5G.2A wording on disk and replacing it with site-owner-approved text
  // that states risks/variability instead of asserting safety or efficacy.
  {
    slug: "beard-transplant-cost-turkey",
    label: "5G.2A.1: remove unsupported 'high success rates' claim",
    find: "<span>Beard transplant operations generally have high success rates, particularly when performed with the FUE technique by expert plastic surgeons. Individual results vary, and your doctor can advise on what to expect in your case.</span>",
    replace:
      "<span>Beard transplant outcomes vary between patients. The treating doctor can assess suitability and explain the potential benefits, limitations and risks.</span>",
    expectedCount: 1,
  },
  {
    slug: "frequently-asked-questins-in-botox",
    label: "5G.2A.1: remove unsupported 'low risk of side effects' claim",
    find: "Botox is generally well-tolerated with a low risk of side effects when administered by a qualified practitioner, and can be used as an alternative to some surgeries with highly controlled application.",
    replace: "Botox injections can cause side effects and complications. A qualified healthcare professional should assess whether the treatment is appropriate for each patient.",
    expectedCount: 1,
  },
  {
    slug: "does-hair-transplant-work",
    label: "5G.2A.1: remove unsupported 'high success rate' claim",
    find: "Hair transplantation has a high success rate and is a well-established, medically proven procedure. Results can vary between patients, and your doctor can discuss realistic expectations for your case. ",
    replace: "Hair transplantation may improve hair coverage in suitable candidates, but individual results vary and cannot be guaranteed. ",
    expectedCount: 1,
  },
  {
    slug: "how-to-maximize-hair-transplant-results",
    label: "5G.2A.1: remove unsupported 'medically proven' / 'extensive clinical experience' claims",
    find: "Hair transplantation is a well-established, medically proven method for allowing new hair to grow, and its effectiveness is supported by extensive clinical experience.",
    replace: "Hair transplantation is a surgical procedure. Results depend on several individual factors, including donor hair characteristics, treatment planning and healing.",
    expectedCount: 1,
  },
  {
    slug: "beard-transplant-in-turkey",
    label: "5G.2A.1: remove unsupported 'relatively low complication rate' claim",
    find: "<li><span>It has a relatively low complication rate compared to other surgical treatments.</span></li>",
    replace: "<li><span>Beard transplantation is a surgical procedure and carries potential risks and complications. These should be discussed with the treating doctor.</span></li>",
    expectedCount: 1,
  },
  {
    slug: "frequently-asked-questions-in-hair-transplant",
    label: "5G.2A.1: remove unsupported 'low complication rate' / 'adverse effects uncommon' claims",
    find: "This procedure has a relatively low complication rate and is performed under local anaesthesia. Significant health-related adverse effects are uncommon, though individual experiences may vary.",
    replace: "Hair transplantation carries potential risks and complications. The treating doctor should explain these risks and assess individual suitability before the procedure.",
    expectedCount: 1,
  },

  // Phase 5G.2B.1 (2026-10-12): 4 P0 corporate-identity / result-guarantee
  // findings from the Phase 5G.2B read-only audit that were missed by the
  // original 9-article 5G.2A batch.
  {
    slug: "hair-transplant-for-women-in-turkey",
    label: "5G.2B.1: remove 'we guarantee' permanent/natural result claim",
    find: "Once a manual hair transplant is done, we guarantee that the results will be permanent and natural hair will start growing fuller, healthier, and thicker in just a few weeks.",
    replace: "Hair transplant outcomes and timelines vary between patients. The treating doctor can explain the potential benefits, limitations and risks.",
    expectedCount: 1,
  },
  {
    slug: "hair-transplant-for-women-in-turkey",
    label: "5G.2B.1: 'our surgeons' corporate-identity framing",
    find: "our surgeons",
    replace: "the treating surgeon",
    expectedCount: 1,
  },
  {
    slug: "how-much-do-dental-implants-cost-in-turkey",
    label: "5G.2B.1: remove 'we guarantee you will not regret' claim (deleted outright, no replacement claim)",
    find: "We guarantee that you will not regret having your teeth fixed in Turkey. ",
    replace: "",
    expectedCount: 1,
  },
  {
    // NBSP (U+00A0) characters are scattered through this WXR-sourced
    // paragraph (a WordPress/Word-paste artifact) -- the find string below
    // preserves them exactly as they appear on disk.
    slug: "septoplasty-cost-in-turkey",
    label: "5G.2B.1: remove 'we perform a operation' claim + surrounding broken English",
    find: "It is the surgery that we apply to correct the complications that occur after the primary surgery of individuals who have had SEPTOPLASTY surgery before. We perform a operation to get rid of nasal congestion and crooked cartilage structures that don't seem to be adequately corrected within the first surgery.",
    replace: "Septoplasty is a surgical procedure intended to address certain structural causes of nasal obstruction.",
    expectedCount: 1,
  },
  {
    // Two U+200B (zero-width space) characters appear between "of" and "the
    // patient" in the source -- preserved exactly as on disk.
    slug: "blepharoplasty-price-in-turkey",
    label: "5G.2B.1: neutralize 'we perform the necessary examinations'",
    find: "Before deciding on eyelid aesthetics, we perform the necessary examinations around the eyes of our patients and examine the amount of fat in the lower and upper eyelids, the amount of wrinkles, and swelling in the eye area of ​​the patient. ",
    replace: "Before eyelid surgery, the treating healthcare professional assesses the patient's eye area and medical suitability. ",
    expectedCount: 1,
  },

  // Phase 5G.2B.2 (2026-10-12): remaining corporate-identity corrections
  // (simple ownership-pronoun swaps plus claim-removing rewrites where an
  // 'our X' reference was chained to an unverified facility/surgeon/outcome
  // claim) and the 8 implementable P1 medical-claims findings from the
  // Phase 5G.2B read-only audit. Per the site owner's explicit instruction:
  // claims are removed, not relabeled onto 'the clinic'/'the doctor' or
  // replaced with a different unverified claim. the-best-hospitals-in-turkey
  // is deliberately excluded (deferred to its own phase: it is a 10-hospital
  // named listicle, not a contained pronoun/claim fix). 5 articles
  // (the-best-hair-transplant-in-turkey, face-plastic-surgery-cost,
  // best-hospital-in-turkey-for-gastric-sleeve, dentist-in-turkey-reviews,
  // hair-transplant-cost-uk) are deliberately excluded and flagged for
  // human clinical review instead -- see the Phase 5G.2B.2 report.
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.2: remove Estethica mission/vision/goals manifesto block (named hospital brand, deleted outright per site owner instruction, no replacement claim added)",
    find: "<span>Our institution, which acts with the motto of healthy beauty in all fields, especially in aesthetic surgery and hair transplantation, always undertakes the task of pioneering and guiding the sector. With our advanced R&amp;D centre, the world's largest aesthetic surgery centre, our expert team, and our fully equipped clinics, we continue to serve in four locations for now. We are constantly working to improve ourselves and our service quality. The goals, mission and vision of our hospital, which provides services with advanced techniques in aesthetic surgery and hair transplantation and the most successful doctors in the field, are as follows;</span>\n\n<span>Our Goals as Estethica;</span>\n<ul>\n \t<li><span>To provide cutting-edge worldwide research in all of our hospitals' service areas,</span></li>\n \t<li><span>To ensure that new values \u200b\u200bare added to everything we do while meeting the needs and expectations of the society we serve,</span></li>\n \t<li><span>Contributing to the health education of patients and their relatives, and therefore of our entire society,</span></li>\n \t<li><span>Creating 'added value' systems that will reflect personal performance positively to corporate performance,</span></li>\n \t<li><span>To guarantee the greatest degree of patient and family satisfaction,</span></li>\n \t<li><span>To ensure that all personnel working in Estethica are professionals who have the knowledge and experience to perform their duties well and correctly,</span></li>\n \t<li><span>To serve with zero error.</span></li>\n</ul>\n<span>Our Mission:</span>\n<span>Prioritising patient safety, using modern knowledge and cutting-edge technology without compromising ethical values, supporting a continuous education policy; To make our hospital the most favoured healthcare facility by providing services that are centred on the delight of clients, companions, and staff.</span>\n\n<span>Our vision:</span>\n<span>To operate in accordance with the \"ethical\" principles from which we get our name, mindful that delivering healthcare services entails a heavy burden; To rank among the top hospitals by employing the most effective ways of diagnosis and treatment.Invest in your health, invest in a brighter future. Our comprehensive medical programs deliver real results, while you indulge in the beauty and serenity of our destination.</span>",
    replace: "",
    expectedCount: 1,
  },
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.2: 'our clinics' -> treating clinic (digital imaging)",
    find: "Digital imaging techniques are used in our clinics for diagnosis and treatment planning",
    replace: "Digital imaging techniques are used at the treating clinic for diagnosis and treatment planning",
    expectedCount: 1,
  },
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.2: 'our clinics' -> treating clinic (maxillofacial surgeons)",
    find: "performed by oral, dental and maxillofacial surgeons in our clinics.",
    replace: "performed by oral, dental and maxillofacial surgeons at the treating clinic.",
    expectedCount: 1,
  },
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.2: 'our clinics' -> treating clinic (painful/infected teeth)",
    find: "In our clinics, treating painful and infected teeth frequently avoids the need for tooth extraction.",
    replace: "At the treating clinic, treating painful and infected teeth frequently avoids the need for tooth extraction.",
    expectedCount: 1,
  },
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.2: 'our first choice' -> neutral",
    find: "Although it's our first choice to place an implant in eliminating tooth deficiencies",
    replace: "Although placing an implant is often the first choice in eliminating tooth deficiencies",
    expectedCount: 1,
  },
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.2: 'our hyperactive or uncooperative patients' -> neutral",
    find: "general anaesthesia conditions for our hyperactive or uncooperative patients.",
    replace: "general anaesthesia conditions for hyperactive or uncooperative patients.",
    expectedCount: 1,
  },
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.2: 'our clinics' -> treating clinic (pediatric and adult patients)",
    find: "techniques are successfully applied in our clinics for pediatric and adult patients.",
    replace: "techniques are successfully applied at the treating clinic for pediatric and adult patients.",
    expectedCount: 1,
  },
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.2: 'our suggestions' + remove 'without any issues' outcome claim",
    find: "With our suggestions and the meds you'll take, you'll recuperate from the procedure without any issues.",
    replace: "Following the treating doctor's guidance and prescribed medication supports recovery from the procedure.",
    expectedCount: 1,
  },
  {
    slug: "how-long-is-the-hair-transplant-recovery-time-2",
    label: "5G.2B.2: remove 'highest quality'/'highly experienced team'/'advanced devices' unverified claims",
    find: "Our priority in our hospital is to fully meet the expectations of our patients and to provide the highest quality service while keeping their comfort at the highest level. In our Hair Transplantation Unit, we provide service with our highly experienced team working with advanced devices.",
    replace: "The treating hospital aims to meet patient expectations and keep patients comfortable throughout treatment. The Hair Transplantation Unit provides hair transplantation services.",
    expectedCount: 1,
  },
  {
    slug: "plastic-surgery-for-men-trends-and-procedures",
    label: "5G.2B.2: 'our surgeons' -> treating surgeons",
    find: "the patient's entire facial appearance is frequently improved by the results our surgeons achieve.",
    replace: "the patient's entire facial appearance is frequently improved by the results the treating surgeons achieve.",
    expectedCount: 1,
  },
  {
    slug: "plastic-surgery-for-men-trends-and-procedures",
    label: "5G.2B.2: 'Our highly skilled' -> treating plastic surgeons (drop qualifier)",
    find: "Our highly skilled plastic surgeons operate on the underlying muscle, fat, and tissue in addition to",
    replace: "The treating plastic surgeons operate on the underlying muscle, fat, and tissue in addition to",
    expectedCount: 1,
  },
  {
    slug: "plastic-surgery-for-men-trends-and-procedures",
    label: "5G.2B.2: 'Our standard' -> The standard",
    find: "Our standard tumescent liposuction procedure reduces post-operative bleeding and bruises.",
    replace: "The standard tumescent liposuction procedure reduces post-operative bleeding and bruises.",
    expectedCount: 1,
  },
  {
    slug: "plastic-surgery-for-men-trends-and-procedures",
    label: "5G.2B.2: 'one of our plastic surgeons' -> a treating plastic surgeon",
    find: "you will first speak with one of our plastic surgeons to decide on the best surgical strategy.",
    replace: "you will first speak with a treating plastic surgeon to decide on the best surgical strategy.",
    expectedCount: 1,
  },
  {
    slug: "are-neck-lift-in-turkey-worth-the-trip",
    label: "5G.2B.2: drop 'Our' before partner clinics",
    find: "Our partner clinics use modern surgical techniques, comply with international health and safety standards, and provide comprehensive pre- and post-operative care in English.",
    replace: "Partner clinics use modern surgical techniques, comply with international health and safety standards, and provide comprehensive pre- and post-operative care in English.",
    expectedCount: 1,
  },
  {
    slug: "are-neck-lift-in-turkey-worth-the-trip",
    label: "5G.2B.2: remove unverified volume ('hundreds every year') + surgeon-training claims",
    find: "Our partner surgeons perform hundreds of neck lift surgeries every year for patients from all over the world, including the UK, Europe, the Middle East, and North America. Many of them have received advanced surgical training in leading medical institutions in Europe and the United States, and frequently attend international congresses and workshops to stay updated on the latest technologies and techniques in cosmetic surgery.",
    replace: "Partner surgeons specialize in neck lift and facial contouring procedures for patients from all over the world, including the UK, Europe, the Middle East, and North America. The treating surgeon's qualifications and experience can be discussed during consultation.",
    expectedCount: 1,
  },
  {
    slug: "are-neck-lift-in-turkey-worth-the-trip",
    label: "5G.2B.2: remove 'sets our surgeons apart...delivering natural-looking results' outcome claim",
    find: "What truly sets our surgeons apart is their ability to combine technical excellence with artistic vision, delivering natural-looking, balanced results tailored to each patient's facial structure and aesthetic goals.",
    replace: "Partner surgeons bring technical experience and aesthetic judgment to each procedure. The treating surgeon can discuss what results may be realistic for your individual case during consultation.",
    expectedCount: 1,
  },
  {
    slug: "are-neck-lift-in-turkey-worth-the-trip",
    label: "5G.2B.2: drop 'our' before partner hospitals",
    find: "All our partner hospitals meet or exceed these standards.",
    replace: "All partner hospitals meet or exceed these standards.",
    expectedCount: 1,
  },
  {
    slug: "skin-care-treatment-cost-in-turkey-2025",
    label: "5G.2B.2: remove 'deliver real results' claim (duplicated paragraph, appears twice)",
    find: "Invest in your health, invest in a brighter future. Our comprehensive medical programs deliver real results, while you indulge in the beauty and serenity of our destination.",
    replace: "Invest in your health, invest in a brighter future, and indulge in the beauty and serenity of our destination.",
    expectedCount: 2,
  },
  {
    slug: "skin-care-treatment-cost-in-turkey-2025",
    label: "5G.2B.2: 'our best doctors' -> experienced doctors",
    find: "Thulium laser application in our clinic in Medical Center Turkey. It is made with the experience of our best doctors.",
    replace: "Thulium laser application at the treating clinic. It is carried out by experienced doctors.",
    expectedCount: 1,
  },
  {
    slug: "liposuction-in-2025",
    label: "5G.2B.2: remove 'forefront of innovations'/'next-gen technology'/'trained in latest global techniques' claims",
    find: "At Medical Center Turkey, we\u2019re at the forefront of these innovations. Our clinics are equipped with next-gen technology, and our surgeons are trained in the latest global techniques. Whether you're aiming for subtle refinement or dramatic definition, our expert team tailors the approach to your unique body.",
    replace: "Whether you're aiming for subtle refinement or dramatic definition, the treating surgical team tailors the approach to your unique body.",
    expectedCount: 1,
  },
  {
    slug: "liposuction-in-2025",
    label: "5G.2B.2: remove 'incredible precision'/'ensures optimal healing and long-term success' outcome claims",
    find: "At Medical Center Turkey, we prioritize results and safety. Our skilled surgeons map out your body to target problem zones with incredible precision, and our aftercare program ensures optimal healing and long-term success.",
    replace: "The treating surgeon maps out your body to target problem zones, and an aftercare program supports your recovery.",
    expectedCount: 1,
  },
  {
    slug: "liposuction-in-2025",
    label: "5G.2B.2: remove 'state of the art technology'/'highest standards of care' claims",
    find: "Our clinics are equipped with state of the art technology, and our surgeons follow international protocols to ensure the highest standards of care.",
    replace: "The treating clinic follows recognized medical protocols.",
    expectedCount: 1,
  },
  {
    slug: "prp-in-turkey-platelet-rich-plasma",
    label: "5G.2B.2: remove 'risk-free'/'extremely safe' claims",
    find: "<strong>Risk-free for all types of skin.</strong> PRP is extremely safe because it uses your own natural components.",
    replace: "<strong>Suitable for all skin types.</strong> PRP uses components derived from your own blood.",
    expectedCount: 1,
  },
  {
    slug: "temporal-lift",
    label: "5G.2B.2: remove 'most risk-free' claim",
    find: "Temple lift aesthetics is one of the fastest and most risk-free operations on the face area.",
    replace: "Temple lift aesthetics is one of the fastest operations on the face area.",
    expectedCount: 1,
  },
  {
    slug: "temporal-lift",
    label: "5G.2B.2: remove 'risk-free' claim",
    find: "It is one of the most preferred surgeries in the face area because it is fast, risk-free and gives a youthful expression to the person.",
    replace: "It is one of the most preferred surgeries in the face area because it is fast and gives a youthful expression to the person.",
    expectedCount: 1,
  },
  {
    slug: "spinal-fusion-cost-in-turkey",
    label: "5G.2B.2: remove 'guarantee...successful' claim",
    find: "Working with a qualified surgeon and exploring all appropriate non-surgical options before considering surgery is the greatest approach to guarantee that your procedure will be successful.",
    replace: "Working with a qualified surgeon and exploring all appropriate non-surgical options before considering surgery is an important part of treatment planning.",
    expectedCount: 1,
  },
  {
    slug: "shock-loss-after-hair-transplant",
    label: "5G.2B.2: remove 'guaranteeing...roots' claim",
    find: "Consuming an adequate amount of water is critical for guaranteeing that the planted roots are supplied more easily.",
    replace: "Consuming an adequate amount of water during this period is advisable.",
    expectedCount: 1,
  },
  {
    slug: "shock-loss-after-hair-transplant",
    label: "5G.2B.2: remove the follicle-health guarantee outright, no replacement claim",
    find: "It also guarantees that the new hair follicles created are healthy and of good quality, and that the patient lives a healthy lifestyle in general. ",
    replace: "",
    expectedCount: 1,
  },
  {
    slug: "the-ultimate-hair-transplant-guide-in-turkey",
    label: "5G.2B.2: remove 'guaranteeing common-looking outcomes' claim",
    find: "The FUE method, which is viewed as quite possibly the most current and ordinarily utilized hair transplant methods, guaranteeing common-looking outcomes, has helped its prosperity above and beyond through the usage of uncommon gadgets with sapphire blades.",
    replace: "The FUE method is viewed as one of the most modern and commonly used hair transplant methods, utilizing devices with sapphire blades.",
    expectedCount: 1,
  },
  {
    slug: "the-ultimate-hair-transplant-guide-in-turkey",
    label: "5G.2B.2: remove 'guarantee patients with minimal...inconvenience' claim",
    find: "It is an agreeable technique that is intended to guarantee patients with minimal measure of inconvenience, leaving no outer scars after the system.",
    replace: "It is intended to minimize patient inconvenience, leaving no outer scars after the procedure.",
    expectedCount: 1,
  },
  {
    slug: "the-ultimate-hair-transplant-guide-in-turkey",
    label: "5G.2B.2: remove 'hair grows 100%' absolute claim",
    find: "When one year is completed, it is observed that the hair grows 100%.",
    replace: "Hair growth continues to develop throughout the year following the procedure.",
    expectedCount: 1,
  },
  {
    slug: "the-ultimate-hair-transplant-guide-in-turkey",
    label: "5G.2B.2: remove graft-survival guarantee, no new clinical effectiveness claim invented",
    find: "<li><span>Patented special tissue and organ transplant solution (guarantees the survival of the follicals until the transplantation. Grafts continue feeding like they were still on the head which maximizes the number of new hair growth)</span></li>",
    replace: "<li><span>Special tissue preservation solution used to store grafts before transplantation.</span></li>",
    expectedCount: 1,
  },
  {
    slug: "how-long-is-the-recovery-for-ear-correction-in-turkey",
    label: "5G.2B.2: remove 'guarantees...look and feel their best' claim",
    find: "It helps speed up recovery, prevents complications, and guarantees your ears look and feel their best long-term.",
    replace: "It helps speed up recovery and reduces the risk of complications.",
    expectedCount: 1,
  },
  {
    slug: "what-is-dentistry",
    label: "5G.2B.2: correct logically-impossible 'guarantees there are no problems' claim",
    find: "A routine dental examination guarantees that there are no problems with your teeth, gums, jaws, the interior of your mouth, etc. that could affect your oral health.",
    replace: "A routine dental examination helps identify problems with your teeth, gums, jaws, the interior of your mouth, etc. that could affect your oral health.",
    expectedCount: 1,
  },
  {
    slug: "how-to-get-hernia-surgery-without-insurance",
    label: "5G.2B.2: remove 'almost always works' and unsupported 10% recurrence figure, no new statistic introduced",
    find: "Although surgery almost always works, there is a 10% possibility that the hernia will come back in the future, particularly if the circumstances that led to it persist.",
    replace: "Surgery can be effective, but there is a possibility that the hernia could return in the future, particularly if the circumstances that led to it persist.",
    expectedCount: 1,
  },
  {
    slug: "dhi-plus-gold-hair-transplantation-in-turkey",
    label: "5G.2B.2: 'our doctor' -> treating doctor",
    find: "marked by our doctor is a gentle",
    replace: "marked by the treating doctor is a gentle",
    expectedCount: 1,
  },
  {
    slug: "dhi-plus-gold-hair-transplantation-in-turkey",
    label: "5G.2B.2: 'our doctors' -> treating doctor",
    find: "detailed consultation with our doctors, during which",
    replace: "detailed consultation with the treating doctor, during which",
    expectedCount: 1,
  },
  {
    slug: "dhi-plus-gold-hair-transplantation-in-turkey",
    label: "5G.2B.2: 'our clinics' -> treating clinic",
    find: "is also performed in our clinics.)",
    replace: "is also performed at the treating clinic.)",
    expectedCount: 1,
  },
  {
    slug: "ethnic-rhinoplasty-in-turkey",
    label: "5G.2B.2: 'our clinic' -> treating clinic (full examination)",
    find: "closed rhinoplasty). In our clinic, a full",
    replace: "closed rhinoplasty). At the treating clinic, a full",
    expectedCount: 1,
  },
  {
    slug: "ethnic-rhinoplasty-in-turkey",
    label: "5G.2B.2: 'our clinic' -> treating clinic (before surgery)",
    find: "In our clinic, before ethnic nose surgery",
    replace: "At the treating clinic, before ethnic nose surgery",
    expectedCount: 1,
  },
  {
    slug: "ethnic-rhinoplasty-in-turkey",
    label: "5G.2B.2: 'our clinic' -> treating clinic (anaesthesia, NBSP-preserved)",
    find: "which is performed under\u00a0general anaesthesia\u00a0in our clinic, usually takes",
    replace: "which is performed under\u00a0general anaesthesia\u00a0at the treating clinic, usually takes",
    expectedCount: 1,
  },
  {
    slug: "hair-transplantation-in-istanbul",
    label: "5G.2B.2: 'our doctor' -> treating doctor",
    find: "first examined by our doctor and the number of grafts",
    replace: "first examined by the treating doctor and the number of grafts",
    expectedCount: 1,
  },
  {
    slug: "hair-transplantation-in-istanbul",
    label: "5G.2B.2: 'our doctors' -> treating doctor",
    find: "In this case, our doctors will decide whether",
    replace: "In this case, the treating doctor will decide whether",
    expectedCount: 1,
  },
  {
    slug: "is-hair-transplant-painful",
    label: "5G.2B.2: 'our doctor' -> treating doctor",
    find: "with the painkillers that our doctor will give",
    replace: "with the painkillers that the treating doctor will give",
    expectedCount: 1,
  },
  {
    slug: "is-hair-transplant-painful",
    label: "5G.2B.2: 'our clinic' -> treating clinic",
    find: "Since the FUE technique is used in our clinic, the feeling",
    replace: "Since the FUE technique is used at the treating clinic, the feeling",
    expectedCount: 1,
  },
  {
    slug: "unshaven-and-painless-hair-transplantation",
    label: "5G.2B.2: 'our doctor' -> treating doctor",
    find: "which are marked by our doctor, are carefully collected",
    replace: "which are marked by the treating doctor, are carefully collected",
    expectedCount: 1,
  },
  {
    slug: "unshaven-and-painless-hair-transplantation",
    label: "5G.2B.2: 'our hospitals' -> treating clinic",
    find: "The hair transplantation process performed in our hospitals, which stands out",
    replace: "The hair transplantation process performed at the treating clinic, which stands out",
    expectedCount: 1,
  },
  {
    slug: "14-rhinoplasty-recovery-tips-you-need-to-know",
    label: "5G.2B.2: 'Our doctors' -> The treating doctor",
    find: "Our doctors can see things that you cannot see",
    replace: "The treating doctor can see things that you cannot see",
    expectedCount: 1,
  },
  {
    slug: "are-veneers-bad-for-your-teeth",
    label: "5G.2B.2: 'our doctors' -> treating clinic",
    find: "you can reach our doctors below for",
    replace: "you can reach the treating clinic below for",
    expectedCount: 1,
  },
  {
    slug: "arm-lift-prices-in-turkey",
    label: "5G.2B.2: 'our clinic' -> treating clinic",
    find: "You can reach us through our clinic phones and",
    replace: "You can reach the treating clinic by phone and",
    expectedCount: 1,
  },
  {
    slug: "blepharoplasty-in-turkey",
    label: "5G.2B.2: 'our clinic' -> treating clinic",
    find: "Both of these devices available in our clinic can give",
    replace: "Both of these devices available at the treating clinic can give",
    expectedCount: 1,
  },
  {
    slug: "choosing-the-right-hair-transplant-surgeon-in-turkey",
    label: "5G.2B.2: 'our doctors' -> treating doctors",
    find: "Detailed information about our doctors can be found",
    replace: "Detailed information about the treating doctors can be found",
    expectedCount: 1,
  },
  {
    slug: "frequently-asked-questions-in-hair-transplant",
    label: "5G.2B.2: 'our clinic' -> treating clinic",
    find: "This hat will be given to you by our clinic.",
    replace: "This hat will be given to you by the treating clinic.",
    expectedCount: 1,
  },
  {
    slug: "hair-transplant-after-care-process",
    label: "5G.2B.2: 'our clinic' -> treating clinic",
    find: "The first wash from the cycle will be made by our clinic (day 3)",
    replace: "The first wash from the cycle will be made at the treating clinic (day 3)",
    expectedCount: 1,
  },
  {
    slug: "hair-transplant-in-turkey-best-doctors",
    label: "5G.2B.2: 'our doctors' -> treating doctors",
    find: "You can find more details about our doctors and this procedure",
    replace: "You can find more details about the treating doctors and this procedure",
    expectedCount: 1,
  },
  {
    slug: "healing-process-after-hair-transplantation",
    label: "5G.2B.2: 'our clinic' -> treating clinic",
    find: "You can choose to have a hair wash in our clinic.",
    replace: "You can choose to have a hair wash at the treating clinic.",
    expectedCount: 1,
  },

  // Phase 5G.2B.3 (2026-10-12): the Phase 5G.2B.2 report flagged residual
  // 'Estethica' content in dentists-in-turkey beyond the mission/vision/goals
  // manifesto block already removed -- a TOC entry, an entire H2 section naming
  // 'Estethica Health Group' and specific branch locations, and a separate
  // sentence naming 'Estethica Hospitals'. Per the site owner's explicit
  // instruction: removed outright, with no replacement hospital name, partner
  // relationship, technology, or clinical-capacity claim introduced.
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.3: remove TOC entry for the Estethica-named H2 section",
    find: " \t<li><span>Dentists In Turkey With Estethica</span></li>\n",
    replace: "",
    expectedCount: 1,
  },
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.3: remove 'Dentists In Turkey With Estethica' H2 heading + Estethica Health Group promo paragraph, no replacement hospital/claim added",
    find: "<h2><span><span>Dentists In Turkey With Estethica</span><strong>\n</strong></span></h2>\n<span>Service is offered by Estethica Health Group in Ata\u015fehir, Bakrk\u00f6y, Ni\u015fanta\u015f, and Levent. With its cutting-edge technology, qualified medical professionals, and wealth of expertise, it is a reputable plastic surgery institution that has distinguished itself in Turkey and Europe.\n</span>\n\n",
    replace: "",
    expectedCount: 1,
  },
  {
    slug: "dentists-in-turkey",
    label: "5G.2B.3: remove 'Estethica Hospitals' anaesthesia-room sentence, no replacement facility claim added",
    find: " With the facilities provided by the general anaesthesia rooms in Estethica Hospitals, operations deemed necessary can be performed under general anaesthesia.",
    replace: "",
    expectedCount: 1,
  },

  // Phase 5I (2026-10-12): the Phase 5H pre-launch audit's P0 medical-claims
  // and corporate-identity findings, approved by the site owner with exact
  // replacement text for the 3 'Our hospitals/clinics' direct-ownership
  // claims. No new hospital partnership, certification, clinical-capacity, or
  // medical-success claim is introduced. hair-transplant-cost-uk's two
  // findings (an explicit result guarantee and a reference to an unrelated
  // real UK competitor clinic, 'Harley Street Hair Clinic' -- likely leftover
  // from a scraped/templated source) are deleted outright with no replacement
  // claim. dentist-in-turkey-reviews and best-hospital-in-turkey-for-gastric-
  // sleeve are deliberately excluded from this phase pending a separate
  // business decision; the-best-hospitals-in-turkey remains untouched.
  {
    slug: "tummy-tuck-cost-in-turkey",
    label: "5I: remove 'guarantees a safe and healthy process' claim",
    find: "Rest assured that Turkey at the lowest price guarantees a safe and healthy process.",
    replace: "Turkey is a popular destination for tummy tuck procedures at a lower cost than many other countries.",
    expectedCount: 1,
  },
  {
    slug: "gastric-sleeve-surgery-price",
    label: "5I: remove 'completely safe' / 'have the surgery safely' absolute-safety claims",
    find: "It is completely safe. There are many experienced surgeons and well-equipped hospitals in Turkey. You can have the surgery safely.",
    replace: "As with any surgical procedure, gastric sleeve surgery carries risks that should be discussed with the treating doctor. Turkey has many experienced surgeons and well-equipped hospitals.",
    expectedCount: 1,
  },
  {
    slug: "rhinoplast-nose-job-before-and-after-turkey",
    label: "5I: remove 'Our hospitals' ownership claim (site-owner-approved replacement text)",
    find: "<li><span>Our hospitals are built on a foundation of trust and integrity. We prioritize your safety, privacy, and comfort throughout your journey with us.</span></li>",
    replace: "<li><span>Medical Center Turkey helps patients coordinate their treatment journey, including communication with the treating hospital.</span></li>",
    expectedCount: 1,
  },
  {
    slug: "hair-transplant-surgery-before-and-after-turkey",
    label: "5I: remove 'Our hospitals' ownership claim (site-owner-approved replacement text, identical to rhinoplast-nose-job-before-and-after-turkey)",
    find: "<li><span>Our hospitals are built on a foundation of trust and integrity. We prioritize your safety, privacy, and comfort throughout your journey with us.</span></li>",
    replace: "<li><span>Medical Center Turkey helps patients coordinate their treatment journey, including communication with the treating hospital.</span></li>",
    expectedCount: 1,
  },
  {
    slug: "choosing-the-right-dental-treatment-abroad-in-2025",
    label: "5I: soften 'quality and patient care are guaranteed' claim",
    find: "The key to a safe dental trip abroad is simple: go where quality and patient care are guaranteed.",
    replace: "The key to a safe dental trip abroad is simple: go where quality and patient care are a priority.",
    expectedCount: 1,
  },
  {
    slug: "choosing-the-right-dental-treatment-abroad-in-2025",
    label: "5I: remove 'our clinics'/'FDA approved'/'European sterilization standards'/'glowing reviews' claims (site-owner-approved replacement text)",
    find: "In Turkey, and especially at Medical Center Turkey, safety is our gold standard. Our clinics adhere to strict hygiene protocols, use FDA approved materials, and follow European sterilization standards. We don\u2019t just meet expectations we exceed them, consistently earning glowing reviews from patients worldwide.",
    replace: "Patient safety is an important consideration when choosing a dental clinic. Patients should ask about hygiene protocols, sterilization procedures, and the materials used.",
    expectedCount: 1,
  },
  {
    slug: "hair-transplant-cost-uk",
    label: "5I: remove explicit result-guarantee claim, deleted outright, no replacement claim",
    find: "Our results guarantee that you will enjoy your natural hair again.",
    replace: "",
    expectedCount: 1,
  },
  {
    slug: "hair-transplant-cost-uk",
    label: "5I: remove reference to an unrelated real UK competitor clinic ('Harley Street Hair Clinic'), deleted outright, no replacement claim",
    find: "The hallmark of our work at Harley Street Hair Clinic is to provide specialized care to ensure these procedures provide natural, invisible results that last a lifetime.",
    replace: "",
    expectedCount: 1,
  },
];
assertNoDuplicateRules(MEDICAL_CLAIMS_REPLACEMENTS);

/**
 * Same contract as removeOrganTransplantPromotion()/applyTextQualityFixes()
 * in organ-transplant-cleanup.mjs: all-or-nothing per file, FATAL (ok:false)
 * on any count mismatch rather than a partial or silent apply.
 */
export function applyMedicalClaimsFixes(html, slug) {
  const rules = MEDICAL_CLAIMS_REPLACEMENTS.filter((r) => r.slug === slug);
  const result = applySequentialRules(html, rules);
  if (!result.ok) {
    return { html, changed: false, appliedCount: 0, ok: false, errors: result.errors };
  }
  return result;
}
