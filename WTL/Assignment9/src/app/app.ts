import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  protected readonly title = signal('NexaFlow');

  mobileMenuOpen = false;
  contactForm = { name: '', email: '', message: '' };
  formSubmitted = false;
  formLoading = false;

  features = [
    { icon: '', title: 'Lightning Automation', desc: 'Automate repetitive workflows in minutes, not months. No code required.' },
    { icon: '', title: 'Enterprise Security', desc: 'SOC2 compliant with end-to-end encryption and role-based access control.' },
    { icon: '', title: 'Real-time Analytics', desc: 'Live dashboards that surface insights before they become problems.' },
    { icon: '', title: '200+ Integrations', desc: 'Plug into Slack, Jira, GitHub, Salesforce, and everything in between.' },
    { icon: '', title: 'Global Infrastructure', desc: 'Deployed across 12 regions with 99.99% uptime SLA guaranteed.' },
    { icon: '', title: '24/7 Support', desc: 'Dedicated success engineers available around the clock, every day.' },
  ];

  steps = [
    { num: '01', title: 'Connect Your Tools', desc: 'Link your existing stack with one-click OAuth integrations.' },
    { num: '02', title: 'Build Your Workflow', desc: 'Use our visual builder to automate tasks with no code at all.' },
    { num: '03', title: 'Scale With Confidence', desc: 'Monitor, optimize, and scale workflows from one unified dashboard.' },
  ];

  plans = [
    {
      name: 'Starter', price: '$9', period: '/mo',
      desc: 'Perfect for solo builders and small teams.',
      features: ['5 Active Workflows', '10k Tasks/month', 'Basic Analytics', '3 Integrations', 'Email Support'],
      popular: false, cta: 'Get Started'
    },
    {
      name: 'Pro', price: '$49', period: '/mo',
      desc: 'For growing teams that need more power.',
      features: ['Unlimited Workflows', '500k Tasks/month', 'Advanced Analytics', 'Unlimited Integrations', 'Priority Support', 'Custom Webhooks'],
      popular: true, cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise', price: '$199', period: '/mo',
      desc: 'Tailored for large-scale organizations.',
      features: ['Everything in Pro', 'Unlimited Tasks', 'Dedicated Manager', 'SLA Guarantee', 'SSO & SAML', 'Custom Contracts'],
      popular: false, cta: 'Contact Sales'
    },
  ];

  testimonials = [
    { name: 'Sarah Chen', role: 'CTO at TechNova', quote: "NexaFlow cut our deployment pipeline by 80%. Best investment we've made.", avatar: 'SC', color: 'bg-violet-500' },
    { name: 'Marcus Rivera', role: 'Founder at GrowthBase', quote: 'We automated our entire onboarding funnel in one afternoon. Conversion tripled.', avatar: 'MR', color: 'bg-indigo-500' },
    { name: 'Priya Sharma', role: 'VP Engineering at DataFlow', quote: 'The analytics dashboard alone is worth the price. Team has never been more aligned.', avatar: 'PS', color: 'bg-purple-500' },
  ];

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.mobileMenuOpen = false;
  }

  onSubmit() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) return;
    this.formLoading = true;
    setTimeout(() => {
      this.formLoading = false;
      this.formSubmitted = true;
      this.contactForm = { name: '', email: '', message: '' };
      setTimeout(() => this.formSubmitted = false, 5000);
    }, 1500);
  }
}
