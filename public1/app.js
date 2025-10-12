const e = React.createElement;

function App() {
  const [form, setForm] = React.useState({ firstName: '', lastName: '', rollNo: '', dob: '', gender: '', section: '', email: '', phone: '', course: '' });
  const [status, setStatus] = React.useState(null);
  const [savedStudent, setSavedStudent] = React.useState(null);

  function onChange(eve) {
    setForm({ ...form, [eve.target.name]: eve.target.value });
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setSavedStudent(data.student);
        setForm({ firstName: '', lastName: '', rollNo: '', dob: '', gender: '', section: '', email: '', phone: '', course: '' });
      } else {
        setStatus('error:' + (data.error || 'unknown'));
      }
    } catch (err) {
      setStatus('error:' + err.message);
    }
  }

  // If submission succeeded, render a fresh centered welcome page
  if (status === 'success' && savedStudent) {
    return e('div', { className: 'full-page' },
      e('div', { className: 'card welcome-card' },
        e('h1', null, `Welcome ${savedStudent.firstName} ${savedStudent.lastName}`),
        e('p', { className: 'muted' }, 'to ANITS.'),
        e('p', { style: { marginTop: '18px' } }, e('a', { href: '/', onClick: (e)=>{ e.preventDefault(); window.location.reload(); } }, 'Register another student'))
      )
    );
  }

  return e('div', { className: 'container' },
    e('div', { className: 'card' },
      e('h1', null, 'Student Registration'),
  e('form', { onSubmit },
        e('div', { className: 'row name-row' },
          e('input', { name: 'firstName', placeholder: 'First name', value: form.firstName, onChange }),
          e('input', { name: 'lastName', placeholder: 'Last name', value: form.lastName, onChange })
        ),
        e('div', { className: 'row' },
          e('input', { name: 'email', placeholder: 'Email', type: 'email', value: form.email, onChange })) ,
        e('div', { className: 'row' },
          e('input', { name: 'rollNo', placeholder: 'Roll No', value: form.rollNo, onChange })) ,
        e('div', { className: 'row' },
          e('input', { name: 'dob', placeholder: 'Date of Birth', type: 'date', value: form.dob, onChange })) ,
        e('div', { className: 'row' },
          e('select', { name: 'gender', value: form.gender, onChange },
            e('option', { value: '' }, 'Select gender'),
            e('option', { value: 'Male' }, 'Male'),
            e('option', { value: 'Female' }, 'Female'),
            e('option', { value: 'Other' }, 'Other')
          )) ,
        /* Section input (kept below Course) */
        e('div', { className: 'row' },
          e('input', { name: 'phone', placeholder: 'Phone (optional)', value: form.phone, onChange })) ,
        e('div', { className: 'row' },
          e('input', { name: 'course', placeholder: 'Course', value: form.course, onChange })) ,
        e('div', { className: 'row' },
          e('input', { name: 'section', placeholder: 'Section', value: form.section, onChange })) ,
        e('div', { className: 'actions' },
          e('button', { type: 'submit', className: 'btn' }, 'Register')
        ),
    status === 'loading' && e('p', { className: 'info' }, 'Submitting...'),
    status === 'success' && savedStudent && e('p', { className: 'success welcome' }, `Welcome ${savedStudent.firstName} ${savedStudent.lastName} to ANITS.`),
          status && status.startsWith('error') && e('p', { className: 'error' }, status)
        )
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
