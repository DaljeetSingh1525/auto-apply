export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchResumeAsFile(url: string): Promise<File | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], 'resume.pdf', { type: 'application/pdf' });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
}

export function fillTextInput(element: HTMLInputElement, value: string) {
  element.value = value;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
  element.dispatchEvent(new Event('blur', { bubbles: true }));
}

export function fillSelectInput(element: HTMLSelectElement, value: string) {
  const option = Array.from(element.options).find(opt => 
    opt.text.toLowerCase().includes(value.toLowerCase()) ||
    opt.value.toLowerCase().includes(value.toLowerCase())
  );
  
  if (option) {
    element.value = option.value;
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

export function clickRadioButton(name: string, value: string) {
  const radios = document.querySelectorAll<HTMLInputElement>(`input[type="radio"][name="${name}"]`);
  const targetRadio = Array.from(radios).find(radio => 
    radio.value.toLowerCase() === value.toLowerCase() ||
    radio.parentElement?.textContent?.toLowerCase().includes(value.toLowerCase())
  );
  
  if (targetRadio) {
    targetRadio.checked = true;
    targetRadio.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

export async function uploadFile(input: HTMLInputElement, file: File) {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  input.files = dataTransfer.files;
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

export function scrapeFormQuestions(): Array<{label: string, type: string, options?: string[]}> {
  const questions: Array<{label: string, type: string, options?: string[]}> = [];
  
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    const label = input.closest('label')?.textContent?.trim() || 
                 document.querySelector(`label[for="${input.id}"]`)?.textContent?.trim() ||
                 input.getAttribute('placeholder') || '';
    
    if (label) {
      const question: {label: string, type: string, options?: string[]} = {
        label,
        type: input.tagName.toLowerCase()
      };
      
      if (input.tagName === 'SELECT') {
        const select = input as HTMLSelectElement;
        question.options = Array.from(select.options).map(opt => opt.text);
      }
      
      if (input.tagName === 'INPUT') {
        question.type = (input as HTMLInputElement).type;
      }
      
      questions.push(question);
    }
  });
  
  return questions;
}
