import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../shared/services/language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  languageService = inject(LanguageService);
  // Form models
  formData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  // State control signals
  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);

  onSubmit(form: any) {
    if (form.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.submitSuccess.set(false);
    this.submitError.set(false);

    // Mock submission - In production, user will hook it up to Web3Forms or Formspree
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.submitSuccess.set(true);
      
      // Reset form model
      this.formData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
      
      form.resetForm();
    }, 1500);
  }
}
