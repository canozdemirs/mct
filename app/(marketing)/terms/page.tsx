import type { Metadata } from "next";
import { Nav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Terms & Conditions — Medical Center Turkey",
  description:
    "Terms and conditions governing the use of Medical Center Turkey's international patient coordination and health tourism services.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-24">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-gray-400 mb-10">Last Updated: September 2026</p>

        <div className="space-y-10 text-gray-600 leading-relaxed text-[15px]">

          <p>
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern the use of the Medical Center Turkey website and the international patient coordination and intermediary services provided by Medical Center Turkey.
          </p>
          <p>
            By using our website, submitting an inquiry, requesting information or a preliminary treatment plan, making a booking, or using our coordination services, you acknowledge that you have read and understood these Terms.
          </p>

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">1. About Medical Center Turkey</h2>
            <p className="mb-3">
              Medical Center Turkey (&ldquo;MCT&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an international health tourism intermediary and patient coordination company based in Istanbul, Türkiye.
            </p>
            <p className="mb-3">
              MCT facilitates access for international patients to independent, appropriately licensed healthcare institutions and healthcare professionals in Türkiye and assists with the non-clinical coordination of the patient&rsquo;s treatment journey.
            </p>
            <p className="mb-3">
              <strong className="text-gray-800">MCT is not a hospital, clinic, medical practice, physician, or healthcare provider.</strong>
            </p>
            <p className="mb-3">
              MCT does not itself perform medical examinations, diagnoses, surgical procedures, anaesthesia, sedation, prescriptions, medical treatments, or any other clinical healthcare service.
            </p>
            <p className="mb-3">
              All medical and clinical services are provided independently by the healthcare institution and healthcare professionals responsible for the patient&rsquo;s treatment.
            </p>
            <p className="mb-3">
              <strong className="text-gray-800">Patients do not pay MCT for medical treatment.</strong> Medical treatment and related clinical services are provided by independent healthcare institutions and healthcare professionals.
            </p>
            <p>
              Where required by applicable legislation, MCT works with healthcare facilities holding the relevant authorizations required for international health tourism services.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">2. Scope of MCT Services</h2>
            <p className="mb-3">MCT provides non-clinical international patient coordination and facilitation services, which may include:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Receiving and coordinating treatment inquiries;</li>
              <li>Facilitating communication between patients and healthcare institutions or healthcare professionals;</li>
              <li>Transmitting photographs, medical records, test results, and other information supplied by the patient to relevant healthcare professionals;</li>
              <li>Assisting patients in identifying an appropriate healthcare facility or physician;</li>
              <li>Coordinating appointments and treatment schedules;</li>
              <li>Coordinating accommodation, airport transfers, local transportation, and travel-related arrangements where applicable;</li>
              <li>Translation and patient communication assistance;</li>
              <li>Pre-treatment and post-treatment communication and coordination; and</li>
              <li>General non-clinical assistance throughout the international patient&rsquo;s treatment journey.</li>
            </ul>
            <p className="mb-3">
              The exact services provided may vary according to the patient&rsquo;s individual circumstances and treatment arrangements.
            </p>
            <p>
              MCT does not independently determine medical suitability, diagnose any condition, prescribe treatment, select a surgical technique, determine the number of grafts, prescribe medication, or make any other clinical decision.
            </p>

            <h3 className="text-base font-bold text-gray-800 mt-6 mb-3">2.1 Changes to Healthcare Facility, Physician or Care Team</h3>
            <p className="mb-3">
              MCT works with a network of independent healthcare institutions and healthcare professionals rather than a single healthcare provider.
            </p>
            <p className="mb-3">
              Any healthcare institution, physician, surgeon, or care team mentioned during an initial inquiry or preliminary treatment plan is subject to availability, medical suitability, scheduling, and final confirmation.
            </p>
            <p className="mb-3">
              If the originally proposed healthcare institution or healthcare professional becomes unavailable, MCT may propose an appropriately qualified alternative healthcare institution or healthcare professional.
            </p>
            <p className="mb-3">
              Any material change will be communicated to the patient as soon as reasonably practicable and, where appropriate, the patient&rsquo;s confirmation will be obtained before treatment proceeds.
            </p>
            <p>
              A patient requesting a change of healthcare institution, physician, treatment date, or other confirmed arrangement should inform MCT as early as possible. Such changes may affect availability, scheduling, third-party costs, or other arrangements.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">3. Preliminary Medical Assessments and No Medical Advice by MCT</h2>
            <p className="mb-3">
              Information provided through the MCT website, WhatsApp, email, telephone, social media, or other MCT communication channels is provided for general information and coordination purposes.
            </p>
            <p className="mb-3">
              Where photographs, medical records, test results, scans, or medical history are reviewed remotely, any medical opinion, proposed treatment, estimated graft number, surgical recommendation, or assessment communicated to the patient is preliminary and subject to final clinical examination by the treating healthcare professional.
            </p>
            <p className="mb-3">
              MCT may transmit or communicate information provided by physicians or healthcare institutions to the patient. Such communication does not make MCT the provider or author of the medical advice.
            </p>
            <p>
              Final treatment eligibility, diagnosis, treatment method, surgical technique, number of procedures, number of grafts, medication, anaesthesia or sedation method, and all other clinical decisions are determined exclusively by the treating healthcare professional and/or healthcare institution.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">4. No Guarantee of Medical or Cosmetic Results</h2>
            <p className="mb-3">
              MCT does not guarantee any medical, surgical, cosmetic, dental, hair transplantation, or other treatment result.
            </p>
            <p className="mb-3">
              Individual results may vary according to numerous factors, including the patient&rsquo;s health, anatomy, age, healing characteristics, lifestyle, medication use, adherence to medical instructions, and the nature of the treatment.
            </p>
            <p>
              Before-and-after photographs, patient testimonials, case studies, estimated graft numbers, expected recovery periods, treatment simulations, photographs, videos, or examples of previous patients are provided for general informational or illustrative purposes only. They do not constitute a warranty or guarantee that another patient will achieve the same or similar outcome.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">5. Medical and Clinical Responsibility</h2>
            <p className="mb-3">
              All medical procedures coordinated through MCT are performed independently by healthcare institutions and healthcare professionals.
            </p>
            <p className="mb-3">The treating healthcare institution and healthcare professionals are responsible, within the scope of their professional and legal responsibilities, for all medical and clinical matters, including but not limited to:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Diagnosis;</li>
              <li>Medical examinations;</li>
              <li>Determining suitability for treatment;</li>
              <li>Selection of treatment;</li>
              <li>Surgical planning;</li>
              <li>Selection and performance of surgical techniques;</li>
              <li>Anaesthesia and sedation;</li>
              <li>Medication and prescriptions;</li>
              <li>Infection prevention and clinical safety;</li>
              <li>Medical equipment and materials;</li>
              <li>Surgical and clinical procedures;</li>
              <li>Intraoperative care;</li>
              <li>Postoperative medical care;</li>
              <li>Medical follow-up;</li>
              <li>Management of complications;</li>
              <li>Emergency medical decisions; and</li>
              <li>Clinical outcomes.</li>
            </ul>
            <p className="mb-3">
              MCT does not supervise, direct, control, or interfere with the independent clinical judgment or medical practice of physicians, surgeons, anaesthetists, nurses, or other healthcare professionals.
            </p>
            <p>
              The existence of a coordination or commercial relationship between MCT and a healthcare institution or healthcare professional does not make MCT the provider of the medical treatment.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">6. Medical Complications, Medical Errors and Death</h2>
            <p className="mb-3">
              Medical and surgical treatment inherently involves risks, including complications and, in rare circumstances, serious injury or death.
            </p>
            <p className="mb-3">
              These risks must be explained by the treating healthcare professional and healthcare institution as part of the medical informed consent process.
            </p>
            <p className="mb-3">
              <strong className="text-gray-800">To the maximum extent permitted by applicable law, MCT shall not be responsible or liable for any injury, medical complication, infection, adverse reaction, unsuccessful or unsatisfactory treatment result, medical error, malpractice, clinical negligence, disability, deterioration of health, permanent injury, or death resulting from or relating to medical treatment, surgery, anaesthesia, sedation, medication, clinical care, or any clinical decision made or performed by an independent healthcare institution or healthcare professional.</strong>
            </p>
            <p className="mb-3">
              Any complaint or claim concerning medical malpractice, medical negligence, clinical treatment, surgical performance, medical complications, or treatment outcomes should be directed to the healthcare institution and/or healthcare professional responsible for providing the relevant medical service.
            </p>
            <p>
              Nothing in these Terms transfers the professional or legal medical responsibilities of an independent healthcare provider to MCT.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">7. Treatment Plans, Prices and Payments</h2>
            <p className="mb-3">
              Any preliminary treatment plan or estimated treatment price communicated through MCT is based on the information available at the time and may be subject to final medical examination and confirmation by the healthcare institution.
            </p>
            <p className="mb-3">
              <strong className="text-gray-800">Patients do not pay MCT for medical treatment.</strong>
            </p>
            <p className="mb-3">
              Unless otherwise expressly disclosed, medical treatment charges are payable to the healthcare institution or other relevant independent service provider responsible for providing the service.
            </p>
            <p className="mb-3">
              MCT may communicate quotations or pricing information supplied by healthcare institutions or other service providers as part of its coordination activities. Communicating such information does not make MCT the provider of the underlying medical service.
            </p>
            <p className="mb-3">
              The final treatment plan or price may change where the treating healthcare professional determines after clinical examination that a different procedure, treatment, test, medicine, medical material, implant, or other service is required.
            </p>
            <p className="mb-3">
              Any material change will be communicated to the patient as soon as reasonably practicable.
            </p>
            <p>
              Additional medical or non-medical services requested by the patient or required because of changed circumstances may result in additional charges payable to the relevant provider.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">8. Booking, Cancellation and Refunds</h2>
            <p className="mb-3">
              Booking, cancellation, rescheduling, and refund conditions may depend on the policies of the healthcare institution, hotel, transportation provider, or other independent third-party provider involved.
            </p>
            <p className="mb-3">
              Any specific cancellation or refund conditions communicated to and accepted by the patient as part of a confirmed arrangement will apply to that arrangement, subject to mandatory applicable law.
            </p>
            <p className="mb-3">Where a cancellation occurs, amounts already paid directly to independent third parties or costs already incurred may be subject to the relevant third party&rsquo;s cancellation and refund policies. These costs may include:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Hospital reservation charges;</li>
              <li>Operating room reservations;</li>
              <li>Medical tests or services already provided;</li>
              <li>Specially ordered implants, medical materials, or medicines;</li>
              <li>Hotel or accommodation charges;</li>
              <li>Transportation and transfer costs; and</li>
              <li>Other reasonable and documented third-party expenses.</li>
            </ul>
            <p>
              MCT cannot guarantee the refund of amounts paid directly to an independent healthcare institution or other third-party service provider. Any refund relating to such payment is subject to the relevant provider&rsquo;s terms and applicable law.
            </p>

            <h3 className="text-base font-bold text-gray-800 mt-6 mb-3">8.1 Late Arrival, No-Show, Schedule Changes and Patient-Caused Costs</h3>
            <p className="mb-3">
              Patients are responsible for attending scheduled consultations, medical examinations, procedures, hospital admissions, transfers, and other appointments at the confirmed date and time.
            </p>
            <p className="mb-3">If a patient:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Arrives late;</li>
              <li>Fails to attend;</li>
              <li>Misses an appointment or procedure;</li>
              <li>Changes their confirmed travel arrangements;</li>
              <li>Misses or changes a flight;</li>
              <li>Requests a change of treatment date;</li>
              <li>Causes a delay in the treatment schedule; or</li>
              <li>Otherwise causes a cancellation, delay, or rescheduling for reasons attributable to the patient,</li>
            </ul>
            <p className="mb-3">the patient may be responsible for the reasonable and documented additional costs resulting from those circumstances. Such costs may include:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Hospital or clinic charges;</li>
              <li>Operating room reservation or cancellation charges;</li>
              <li>Physician or medical team charges;</li>
              <li>Rescheduling costs;</li>
              <li>Additional medical tests or services;</li>
              <li>Additional accommodation nights;</li>
              <li>Additional or rearranged transfers;</li>
              <li>Transportation costs; and</li>
              <li>Other reasonable and documented third-party expenses directly resulting from the patient&rsquo;s delay, absence, cancellation, or requested change.</li>
            </ul>
            <p className="mb-3">
              Where an independent healthcare institution or other service provider charges such a cost to MCT because of circumstances attributable to the patient, MCT may seek reimbursement from the patient for the corresponding reasonable and documented third-party cost.
            </p>
            <p>
              MCT will inform the patient of such additional costs as soon as reasonably practicable.
            </p>

            <h3 className="text-base font-bold text-gray-800 mt-6 mb-3">8.2 Where MCT Fails to Provide Its Own Coordination Services</h3>
            <p className="mb-3">
              Where MCT itself fails, due to its own fault, to arrange a confirmed non-clinical coordination service for which MCT was directly responsible, such as a confirmed transfer, translation service, or appointment coordination, MCT will use reasonable efforts to provide or arrange an appropriate alternative solution.
            </p>
            <p>
              This section applies only to MCT&rsquo;s own non-clinical coordination activities and does not apply to the acts, omissions, availability, delays, cancellations, clinical decisions, or performance of independent healthcare institutions, healthcare professionals, or other independent third-party service providers.
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">9. Travel, Flights, Accommodation and Independent Third Parties</h2>
            <p className="mb-3">
              Patients are responsible for obtaining and maintaining valid passports, visas, travel documentation, insurance, and other documents necessary to travel to Türkiye and receive treatment.
            </p>
            <p className="mb-3">
              Unless expressly agreed otherwise, international flights and personal travel expenses are the patient&rsquo;s responsibility.
            </p>
            <p className="mb-3">
              Healthcare institutions, physicians, airlines, hotels, transportation companies, laboratories, pharmacies, translators, and other third-party service providers are independent from MCT.
            </p>
            <p className="mb-3">
              MCT may coordinate or facilitate access to these services but does not control their independent operations.
            </p>
            <p className="mb-3">MCT will use reasonable efforts to assist patients when disruptions occur but cannot guarantee the performance of independent third parties or prevent circumstances outside MCT&rsquo;s reasonable control, including:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Flight cancellations or delays;</li>
              <li>Lost baggage;</li>
              <li>Weather conditions;</li>
              <li>Traffic;</li>
              <li>Government restrictions;</li>
              <li>Visa or border issues;</li>
              <li>Hotel-related issues; or</li>
              <li>Other events outside MCT&rsquo;s reasonable control.</li>
            </ul>
            <p>
              Patients are encouraged to obtain appropriate travel and medical travel insurance.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">10. Patient Responsibilities</h2>
            <p className="mb-3">
              Patients are responsible for providing complete, truthful, accurate, and current information concerning their health and medical history. This includes, where relevant:
            </p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Existing medical conditions;</li>
              <li>Previous surgeries and treatments;</li>
              <li>Allergies;</li>
              <li>Prescription and non-prescription medication;</li>
              <li>Supplements;</li>
              <li>Infectious or communicable diseases;</li>
              <li>Relevant laboratory results;</li>
              <li>Pregnancy where medically relevant;</li>
              <li>Alcohol, tobacco, or substance use where medically relevant; and</li>
              <li>Any other information requested by the treating healthcare professional.</li>
            </ul>
            <p className="mb-3">
              Patients must promptly inform MCT and/or their healthcare provider of any material change in their health or medical information before treatment.
            </p>
            <p className="mb-3">
              Patients are responsible for complying with all medical instructions given by their treating healthcare professionals, including pre-operative and postoperative instructions, medication instructions, recovery requirements, and aftercare.
            </p>
            <p>
              MCT shall not be responsible for adverse consequences resulting from inaccurate or incomplete information supplied by the patient or the patient&rsquo;s failure to follow medical instructions, except where applicable mandatory law provides otherwise.
            </p>

            <h3 className="text-base font-bold text-gray-800 mt-6 mb-3">10.1 Patients Under the Age of 18</h3>
            <p className="mb-3">
              MCT&rsquo;s services are primarily intended for adult international patients.
            </p>
            <p className="mb-3">
              Where treatment involves a person under the age of 18, treatment may proceed only where permitted under applicable Turkish law and the policies of the treating healthcare institution.
            </p>
            <p className="mb-3">
              The required parent or legal guardian consent and documentation must be provided to the treating healthcare institution and/or MCT upon request.
            </p>
            <p>
              All clinical decisions concerning the treatment of a minor remain exclusively with the treating healthcare institution and healthcare professionals.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">11. Personal Data and Health Information</h2>
            <p className="mb-3">
              For the purpose of coordinating international patient services, MCT may collect and process personal data, including health-related information.
            </p>
            <p className="mb-3">
              Health information constitutes special-category personal data under Turkish data protection legislation.
            </p>
            <p className="mb-3">
              Personal data will be processed in accordance with applicable data protection legislation, including Turkish Personal Data Protection Law No. 6698 (&ldquo;KVKK&rdquo;), MCT&rsquo;s Privacy Policy, and applicable privacy notices.
            </p>
            <p className="mb-3">
              Where necessary for coordination and where permitted by applicable law, information may be transmitted to relevant healthcare institutions, physicians, laboratories, hotels, transportation providers, translators, insurers, or other service providers.
            </p>
            <p>
              MCT does not sell patients&rsquo; personal or medical information.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">12. Communications</h2>
            <p className="mb-3">
              By submitting an inquiry, patients authorize MCT to contact them regarding their inquiry and treatment coordination through the contact information they provide, including telephone, email, SMS, or messaging services such as WhatsApp.
            </p>
            <p className="mb-3">
              Treatment-related and service-related communications are separate from promotional or marketing communications.
            </p>
            <p>
              Marketing communications will be conducted in accordance with applicable law.
            </p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">13. Website Information</h2>
            <p className="mb-3">
              MCT makes reasonable efforts to maintain accurate and current website information.
            </p>
            <p className="mb-3">
              However, healthcare professionals, healthcare institutions, treatment availability, package contents, prices, accommodation, transportation arrangements, and other information may change.
            </p>
            <p className="mb-3">
              Website content does not constitute a binding medical recommendation, medical diagnosis, guarantee of treatment, guarantee of availability, or guarantee of results.
            </p>
            <p>
              Obvious typographical, technical, or pricing errors may be corrected.
            </p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">14. Limitation of MCT&rsquo;s Liability</h2>
            <p className="mb-3">
              MCT&rsquo;s role is limited to the non-clinical international patient coordination and intermediary services described in these Terms.
            </p>
            <p className="mb-3">
              To the maximum extent permitted by applicable law, MCT shall not be liable for the acts, omissions, medical decisions, professional negligence, malpractice, clinical performance, or treatment outcomes of independent healthcare institutions or healthcare professionals.
            </p>
            <p className="mb-3">
              MCT shall also not be liable, to the maximum extent permitted by applicable law, for acts or omissions of independent airlines, hotels, transportation providers, laboratories, pharmacies, insurers, or other independent third-party service providers.
            </p>
            <p className="mb-3">
              MCT shall not be liable for indirect or consequential losses resulting from circumstances for which MCT is not legally responsible, including loss of income, missed work, loss of opportunity, additional personal travel expenses, or loss of enjoyment of a trip.
            </p>
            <p className="mb-3">
              MCT remains responsible for its own non-clinical coordination acts or omissions only to the extent that such responsibility is imposed on MCT and cannot lawfully be excluded or limited under applicable mandatory law.
            </p>
            <p className="mb-3">
              <strong className="text-gray-800">Nothing in these Terms shall be interpreted as making MCT medically responsible for treatment performed by an independent healthcare institution or healthcare professional.</strong>
            </p>
            <p>
              Nothing in these Terms excludes or limits any liability that cannot lawfully be excluded or limited under applicable mandatory law.
            </p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">15. Force Majeure</h2>
            <p className="mb-3">
              Neither party shall be responsible for any failure or delay in performing its obligations under these Terms, other than payment obligations, where such failure or delay results from circumstances beyond that party&rsquo;s reasonable control.
            </p>
            <p className="mb-3">This includes, without limitation:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Natural disasters;</li>
              <li>Epidemics or pandemics;</li>
              <li>War;</li>
              <li>Terrorism;</li>
              <li>Civil unrest;</li>
              <li>Governmental acts or restrictions;</li>
              <li>Strikes or labour disputes;</li>
              <li>Power or infrastructure failures; and</li>
              <li>Disruptions to transportation or communication networks.</li>
            </ul>
            <p className="mb-3">
              Where a force majeure event materially affects MCT&rsquo;s ability to provide coordination services, MCT will inform the patient as soon as reasonably practicable and use reasonable efforts to propose an alternative arrangement.
            </p>
            <p>
              This section does not affect any mandatory rights the patient may have under applicable consumer protection law.
            </p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">16. Complaints and Medical Concerns</h2>
            <p className="mb-3">
              Any concern regarding MCT&rsquo;s coordination services should be communicated to MCT as soon as reasonably possible so that it can be investigated.
            </p>
            <p className="mb-3">Any concern relating to:</p>
            <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4">
              <li>Medical treatment;</li>
              <li>Surgical procedures;</li>
              <li>Medical negligence;</li>
              <li>Medical errors;</li>
              <li>Complications;</li>
              <li>Medication;</li>
              <li>Anaesthesia or sedation;</li>
              <li>Infection;</li>
              <li>Clinical follow-up; or</li>
              <li>Treatment results</li>
            </ul>
            <p className="mb-3">
              should be addressed to the healthcare institution and/or healthcare professional responsible for providing the relevant medical service.
            </p>
            <p>
              In a medical emergency, patients should immediately contact the treating healthcare institution or appropriate emergency medical services.
            </p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">17. Governing Law and Disputes</h2>
            <p className="mb-3">
              These Terms are governed by the laws of the Republic of Türkiye.
            </p>
            <p className="mb-3">
              Subject to any mandatory jurisdiction or consumer protection rules that apply in the patient&rsquo;s favor, the Istanbul (Çağlayan) Courts and Enforcement Offices shall have jurisdiction over any dispute relating specifically to MCT&rsquo;s own coordination services.
            </p>
            <p className="mb-3">
              Where the patient qualifies as a consumer under applicable Turkish consumer protection law, the patient may alternatively bring proceedings before the consumer arbitration committee or consumer court of their own place of residence, or any other venue mandatorily available to them under applicable law.
            </p>
            <p>
              Nothing in these Terms is intended to remove or restrict any mandatory legal right or remedy that cannot lawfully be waived.
            </p>
          </section>

          {/* 18 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">18. Severability and No Waiver</h2>
            <p className="mb-3">
              If any provision of these Terms is held to be invalid, illegal, or unenforceable under applicable law, that provision shall be deemed modified to the minimum extent necessary to make it valid and enforceable or, if it cannot be so modified, shall be severed.
            </p>
            <p className="mb-3">
              The remaining provisions of these Terms shall continue in full force and effect.
            </p>
            <p>
              MCT&rsquo;s failure to enforce any provision of these Terms at any time shall not be construed as a waiver of that provision or of MCT&rsquo;s right to enforce it subsequently.
            </p>
          </section>

          {/* 19 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">19. Assignment</h2>
            <p className="mb-3">
              MCT may transfer or assign its rights and obligations under these Terms, in whole or in part, to another entity in connection with a reorganization, merger, acquisition, or transfer of its business, provided that such transfer does not reduce the patient&rsquo;s rights under these Terms.
            </p>
            <p>
              Patients may not assign their rights or obligations under these Terms without MCT&rsquo;s prior written consent.
            </p>
          </section>

          {/* 20 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">20. Language</h2>
            <p className="mb-3">
              These Terms may be made available in Turkish and in other languages, including English, for the convenience of international patients.
            </p>
            <p>
              In the event of any conflict or inconsistency between language versions, and subject to any mandatory requirement of applicable law, the Turkish-language version shall prevail for matters governed by Turkish law, save that the version relied upon by a consumer for the purpose of asserting a mandatory consumer right shall prevail to that limited extent.
            </p>
          </section>

          {/* 21 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">21. Changes to These Terms</h2>
            <p>
              MCT may update these Terms from time to time to reflect changes in legislation, services, business practices, or operational arrangements. The current version will be published on the MCT website together with its latest revision date.
            </p>
          </section>

          {/* 22 */}
          <section>
            <h2 className="text-xl font-bold text-brand mb-4">22. Contact Information</h2>
            <p className="mb-4">
              For questions regarding these Terms &amp; Conditions or Medical Center Turkey&rsquo;s coordination services, please contact:
            </p>
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="font-bold text-gray-800">Medical Center Turkey</p>
              <p className="text-gray-600">International Patient Center</p>
              <p className="text-gray-600 mb-3">Istanbul, Türkiye</p>
              <p>
                <span className="text-gray-500 text-sm">Email: </span>
                <a href="mailto:hello@medicalcenterturkey.com" className="text-teal hover:underline font-medium">
                  hello@medicalcenterturkey.com
                </a>
              </p>
            </div>
            <p className="mt-4 text-sm text-gray-400">
              For matters concerning personal data, please refer to our Privacy Policy and applicable KVKK privacy notices.
            </p>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
