/**
 * Site-wide configuration — update real details here.
 * All pages read from this single source of truth.
 */
const SITE_CONFIG = {
  doctor: {
    name: "Dr. Chethan Kumar",
    title: "Consultant Orthopedic Surgeon",
    qualifications: "MBBS, MS (Orthopedics), Fellowship in Joint Replacement & Sports Medicine",
    experience: "15+",
    surgeries: "2,000+",
    patients: "5,000+",
    bio: "Fellowship-trained orthopedic surgeon specializing in hip & knee replacement, arthroscopy, sports injuries, trauma, and fracture care. Compassionate, evidence-based treatment with a patient-first philosophy.",
    photo: "assets/images/doctor/doctor-placeholder.jpg",
    photoAlt: "Dr. Chethan Kumar - Orthopedic Surgeon in JP Nagar and RR Nagar, Bengaluru"
  },

  brand: {
    name: "Viksha Orthopedic Clinic",
    tagline: "Trusted Orthopedic Care. Expert Hands. Better Mobility.",
    subheading: "Consultant Orthopedic, Joint Replacement, Sports Injury & Trauma Specialist in JP Nagar and RR Nagar, Bengaluru."
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
      name: "Viksha Orthopedic Clinic – JP Nagar",
      area: "JP Nagar",
      address: "3rd Phase, JP Nagar, Near Mini Forest, Bengaluru – 560078",
      timings: "Mon–Sat: 9:00 AM – 8:00 PM | Sun: 10:00 AM – 2:00 PM",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.585!3d12.906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzIxLjYiTiA3N8KwMzUnMDYuMCJF!5e0!3m2!1sen!2sin!4v1"
    },
    {
      id: "rr-nagar",
      name: "Viksha Orthopedic Clinic – RR Nagar",
      area: "RR Nagar",
      address: "Ideal Homes Layout, RR Nagar, Bengaluru – 560098",
      timings: "Mon–Sat: 10:00 AM – 7:00 PM | Sun: Closed",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.505!3d12.925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU1JzMwLjAiTiA3N8KwMzAnMTguMCJF!5e0!3m2!1sen!2sin!4v1"
    }
  ],

  serviceAreas: [
    "JP Nagar", "RR Nagar", "Banashankari", "Uttarahalli",
    "Kanakapura Road", "Jayanagar", "Bengaluru South"
  ],

  social: {
    facebook: "#",
    instagram: "#",
    linkedin: "#",
    youtube: "#"
  },

  seo: {
    siteUrl: "",
    defaultTitle: "Dr. Chethan Kumar | Orthopedic Surgeon Bengaluru",
    defaultDescription: "Consultant Orthopedic Surgeon in JP Nagar & RR Nagar, Bengaluru. Expert in knee replacement, hip replacement, sports injury & trauma surgery. Book appointment today."
  }
};
