/**
 * Site-wide configuration — update real details here.
 * All pages read from this single source of truth.
 */
const SITE_CONFIG = {
  doctor: {
    name: "Dr. Chethan Kumar",
    title: "Consultant Orthopaedic Surgeon",
    qualifications: "MBBS, MS in Orthopaedics, Fellowship in Joint Replacement and Sports Medicine",
    experience: "15+",
    surgeries: "2,000+",
    patients: "5,000+",
    bio: "Dr. Chethan Kumar is a consultant orthopaedic surgeon serving patients in JP Nagar, RR Nagar, Banashankari, Uttarahalli, Kanakapura Road, Jayanagar and South Bengaluru. He combines surgical expertise with conservative treatment approaches, helping patients understand their condition and explore all appropriate options before making a decision. Patient-first, evidence-based care focused on restoring mobility.",
    photo: "assets/images/doctor/doctor-placeholder.jpg",
    photoAlt: "Dr. Chethan Kumar - Orthopaedic Surgeon in JP Nagar and RR Nagar, Bengaluru"
  },

  brand: {
    name: "Viksha Orthopaedic Clinic",
    tagline: "Trusted Orthopaedic Care. Expert Hands. Better Mobility.",
    subheading: "Consultant Orthopaedic, Joint Replacement, Sports Injury & Trauma Specialist in JP Nagar and RR Nagar, Bengaluru."
  },

  contact: {
    phone: "+919876543210",
    phoneDisplay: "+91 98765 43210",
    whatsapp: "919876543210",
    email: "info@vikshaclinic.com"
  },

  clinics: [
    {
      id: "jp-nagar",
      name: "Viksha Orthopaedic Clinic – JP Nagar",
      area: "JP Nagar",
      address: "3rd Phase, JP Nagar, Near Mini Forest, Bengaluru – 560078",
      timings: "Mon–Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 2:00 PM",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.585!3d12.906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzIxLjYiTiA3N8KwMzUnMDYuMCJF!5e0!3m2!1sen!2sin!4v1"
    },
    {
      id: "rr-nagar",
      name: "Viksha Orthopaedic Clinic – RR Nagar",
      area: "RR Nagar",
      address: "Ideal Homes Layout, RR Nagar, Bengaluru – 560098",
      timings: "Mon–Sat: 10:00 AM – 7:00 PM | Sun: Closed",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.505!3d12.925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzMwLjAiTiA3N8KwMzAnMTguMCJF!5e0!3m2!1sen!2sin!4v1"
    }
  ],

  serviceAreas: [
    "JP Nagar", "RR Nagar", "Banashankari", "Uttarahalli",
    "Kanakapura Road", "Jayanagar", "South Bengaluru"
  ],

  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
    youtube: "#"
  },

  seo: {
    siteUrl: "",
    defaultTitle: "Dr. Chethan Kumar | Orthopaedic Surgeon Bengaluru",
    defaultDescription: "Consultant orthopaedic surgeon in JP Nagar and RR Nagar, Bengaluru. Patient-first, evidence-based care. Knee and hip replacement, sports injury and trauma surgery. Book an appointment."
  }
};
