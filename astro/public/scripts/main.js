/* MonoQ main.js build 2026-05-27-2340 */
(function(){
  function initOpening(){
    const opening = document.getElementById('opening');
    if(!opening || opening.dataset.ready === '1') return;
    opening.dataset.ready = '1';

    const finish = () => {
      const remove = () => opening.remove();
      if(opening.animate){
        opening.animate(
          [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(1.02)' }],
          { duration: 520, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
        ).onfinish = remove;
      } else {
        opening.style.opacity = '0';
        setTimeout(remove, 520);
      }
    };

    if(!window.anime){
      setTimeout(finish, 1200);
      return;
    }

    anime.set('.op-logo .logo-path', { opacity: 0, scale: .92, translateX: 0 });
    anime.set('.op-logo .st0', { rotate: -18, scale: .72 });
    anime.set('.op-logo .st1, .op-logo .st2, .op-logo .st3', { translateX: -22, scale: .94 });

    anime.timeline({ easing: 'easeInOutSine' })
      .add({
        targets: '.op-logo .st0',
        opacity: [0, 1],
        scale: [.72, 1],
        rotate: [-18, 0],
        duration: 760,
        delay: anime.stagger(120),
        easing: 'easeOutElastic(1, .65)'
      })
      .add({
        targets: '.op-logo .st1, .op-logo .st2, .op-logo .st3',
        opacity: [0, 1],
        translateX: [-22, 0],
        scale: [.94, 1],
        duration: 860,
        delay: anime.stagger(70),
        easing: 'easeOutElastic(1, .55)'
      }, '-=340')
      .add({
        targets: '.op-logo',
        scale: [1, 1.018, 1],
        duration: 420,
        easing: 'easeInOutQuad',
        complete: () => setTimeout(finish, 360)
      });
  }

  function initHero(){
    const rcmd = document.getElementById('rcmd');
    const rhead = document.getElementById('rhead');
    const rsub = document.getElementById('rsub');
    const bmsg = document.getElementById('bmsg');
    if(!rcmd || !rhead || !rsub || !bmsg || rcmd.dataset.ready === '1') return;
    rcmd.dataset.ready = '1';

    const bgl = document.getElementById('bgl');
    if(bgl && bgl.children.length === 0){
      const lines = [
        '#!/usr/bin/env bash',
        '# monoq-skill.sh v1.0',
        "TITLE='engineer_skill_value'",
        'eval_run() {',
        "  printf '%s\\n' \"$TITLE\"",
        '  bias --remove && skill_matrix --init',
        '}',
        '$ monoq test --engineer profile.json',
        '$ monoq score --visualize skill.json',
        'SELECT skill,level FROM engineers WHERE bias=0;',
        "git commit -m 'visualize engineer skill'",
        'kubectl apply -f eval-deploy.yaml',
        'const test = new CodingTest();',
        'await test.score({ profile: engineer });'
      ];
      [
        { l: '1%', d: 34, t: 0, g: 1 },
        { l: '13%', d: 27, t: -10, g: 0 },
        { l: '28%', d: 40, t: -18, g: 1 },
        { l: '46%', d: 30, t: -5, g: 0 },
        { l: '62%', d: 36, t: -23, g: 2 },
        { l: '76%', d: 28, t: -14, g: 0 },
        { l: '91%', d: 33, t: -8, g: 1 }
      ].forEach((c) => {
        const el = document.createElement('div');
        el.className = 'bgc';
        const col = c.g === 2 ? 'rgba(255,132,0,0.05)' : (c.g === 1 ? 'rgba(78,216,81,0.07)' : 'rgba(129,208,215,0.05)');
        el.style.cssText = `left:${c.l};animation-duration:${c.d}s;animation-delay:${c.t}s;color:${col}`;
        let text = '';
        for(let i = 0; i < 55; i++) text += lines[Math.floor(Math.random() * lines.length)] + '\n';
        el.textContent = text + text;
        bgl.appendChild(el);
      });
    }

    const CMD = '$ bash monoq-skill.sh';
    const HEAD = 'エンジニアの実力を、\n<span class="em">正しく評価する。</span>';
    const SUB = 'AIコーディングテストでスキルを可視化し、\n採用と評価の意思決定を支える。';
    const BODY = 'モノクは、技術力が正しく評価される社会をつくります。';

    function typ(el, text, spd, cur, done, allowHtml, keepCursor){
      let i = 0;
      el.innerHTML = `<span class="${cur}"></span>`;
      (function tick(){
        if(i < text.length){
          if(allowHtml && text.substr(i, 4) === '<spa'){
            const close = text.indexOf('</span>', i);
            if(close > -1){
              const chunk = text.substring(i, close + 7);
              let current = el.innerHTML.replace(/<span class="(cbg|cbt|cbs)"[^>]*><\/span>/g, '');
              el.innerHTML = current + chunk + `<span class="${cur}"></span>`;
              i = close + 7;
              setTimeout(tick, spd * 2);
              return;
            }
          }
          const ch = text[i++];
          let current = el.innerHTML.replace(/<span class="(cbg|cbt|cbs)"[^>]*><\/span>/g, '');
          el.innerHTML = current + (ch === '\n' ? '<br>' : ch) + `<span class="${cur}"></span>`;
          setTimeout(tick, spd + Math.random() * spd * .5);
        } else {
          if(!keepCursor) el.innerHTML = el.innerHTML.replace(/<span class="(cbg|cbt|cbs)"[^>]*><\/span>/g, '');
          if(done) done();
        }
      })();
    }

    const heroStartDelay = document.getElementById('opening') ? 2100 : 250;
    setTimeout(() => {
      typ(rcmd, CMD, 40, 'cbg', () => {
        setTimeout(() => {
          typ(rhead, HEAD, 82, 'cbg', () => {
            setTimeout(() => {
              typ(rsub, SUB, 32, 'cbt', () => {
                setTimeout(() => typ(bmsg, BODY, 26, 'cbs', () => {}, false, true), 300);
              });
            }, 200);
          }, true);
        }, 350);
      });
    }, heroStartDelay);

    const pf = document.getElementById('pf');
    const pp = document.getElementById('pp');
    const pr = document.getElementById('pr');
    let p = 0;
    if(pf && pp && pr){
      setTimeout(function go(){
        if(p <= 18){
          pf.textContent = '='.repeat(p) + (p < 18 ? '>' : '');
          pp.textContent = Math.round(p / 18 * 100) + '%';
          p++;
          setTimeout(go, 175);
        } else {
          pr.style.opacity = '1';
        }
      }, heroStartDelay + 1700);
    }
  }

  function initNav(){
    const nav = document.getElementById('gnav');
    if(!nav || nav.dataset.ready === '1') return;
    nav.dataset.ready = '1';
    const onScroll = () => {
      if(window.scrollY > 80) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initReveal(){
    const els = document.querySelectorAll('.reveal:not(.in)');
    if(!('IntersectionObserver' in window)){
      els.forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
  }

  function initFaq(){
    document.querySelectorAll('#faq-list .faq-item').forEach((item, i) => {
      const btn = item.querySelector('.faq-q');
      if(!btn || btn.dataset.ready === '1') return;
      btn.dataset.ready = '1';
      btn.addEventListener('click', () => {
        document.querySelectorAll('#faq-list .faq-item').forEach((other) => {
          if(other !== item) other.classList.remove('open');
        });
        item.classList.toggle('open');
      });
      if(i === 0) item.classList.add('open');
    });
  }

  function initContact(){
    document.querySelectorAll('.ct-form').forEach((form) => {
      if(form.dataset.contactReady === '1') return;
      form.dataset.contactReady = '1';
      const section = form.closest('#contact');
      const modal = section ? section.querySelector('#contact-confirm') : null;
      const result = form.querySelector('.ct-result');
      const error = modal ? modal.querySelector('[data-confirm-error]') : null;
      const sendBtn = modal ? modal.querySelector('[data-confirm-send]') : null;
      const closeBtns = modal ? modal.querySelectorAll('[data-confirm-close]') : [];
      const submitBtn = form.querySelector('.ct-submit');
      const getValue = (name) => {
        const field = form.elements[name];
        return field ? String(field.value || '').trim() : '';
      };
      const setBusy = (busy) => {
        if(sendBtn) sendBtn.disabled = busy;
        if(submitBtn) submitBtn.disabled = busy;
        form.dataset.sending = busy ? '1' : '0';
      };
      const closeModal = () => {
        if(!modal) return;
        modal.classList.remove('is-open');
        modal.hidden = true;
        if(error) error.hidden = true;
      };
      const openModal = () => {
        if(!modal) return;
        const values = {
          company: getValue('company'),
          name: getValue('name'),
          tel: getValue('tel'),
          email: getValue('email'),
          message: getValue('message') || '未入力'
        };
        Object.entries(values).forEach(([key, value]) => {
          const target = modal.querySelector(`[data-confirm-field="${key}"]`);
          if(target) target.textContent = value;
        });
        if(error) error.hidden = true;
        modal.hidden = false;
        requestAnimationFrame(() => modal.classList.add('is-open'));
        if(sendBtn) sendBtn.focus();
      };
      const getRecaptchaToken = () => new Promise((resolve, reject) => {
        const siteKey = form.dataset.recaptchaSiteKey;
        const token = form.querySelector('.recaptcha-token');
        let done = false;
        const timeout = setTimeout(() => {
          if(done) return;
          done = true;
          reject(new Error('reCAPTCHAの認証がタイムアウトしました。ページを再読み込みして再度お試しください。'));
        }, 10000);
        if(!siteKey || !token){
          clearTimeout(timeout);
          done = true;
          resolve();
          return;
        }
        if(!window.grecaptcha || typeof window.grecaptcha.ready !== 'function'){
          clearTimeout(timeout);
          done = true;
          reject(new Error('reCAPTCHAの読み込みに失敗しました。時間をおいて再度お試しください。'));
          return;
        }
        window.grecaptcha.ready(() => {
          window.grecaptcha.execute(siteKey, { action: 'contact' }).then((value) => {
            if(done) return;
            done = true;
            clearTimeout(timeout);
            token.value = value;
            resolve();
          }).catch(() => {
            if(done) return;
            done = true;
            clearTimeout(timeout);
            reject(new Error('reCAPTCHAの認証に失敗しました。時間をおいて再度お試しください。'));
          });
        });
      });
      const showResult = (message, ok) => {
        if(!result) return;
        result.textContent = message;
        result.classList.toggle('is-error', !ok);
        result.hidden = false;
      };
      const submitContact = async () => {
        if(form.dataset.sending === '1') return;
        setBusy(true);
        if(error) error.hidden = true;
        try{
          const token = form.querySelector('.recaptcha-token');
          if(token) token.value = '';
          await getRecaptchaToken();
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 20000);
          const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
          });
          clearTimeout(timeout);
          const data = await response.json().catch(() => ({ ok: false, message: '送信に失敗しました。時間をおいて再度お試しください。' }));
          if(!response.ok || !data.ok){
            throw new Error(data.message || '送信に失敗しました。時間をおいて再度お試しください。');
          }
          closeModal();
          form.reset();
          showResult(data.message || 'お問い合わせを受け付けました。', true);
        }catch(err){
          const message = err && err.name === 'AbortError'
            ? '送信処理がタイムアウトしました。時間をおいて再度お試しください。'
            : (err && err.message ? err.message : '送信に失敗しました。時間をおいて再度お試しください。');
          if(error){
            error.textContent = message;
            error.hidden = false;
          } else {
            showResult(message, false);
          }
        }finally{
          setBusy(false);
        }
      };

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if(!form.reportValidity()) return;
        if(result) result.hidden = true;
        if(modal){
          openModal();
          return;
        }
        submitContact();
      });
      closeBtns.forEach((btn) => btn.addEventListener('click', closeModal));
      if(sendBtn) sendBtn.addEventListener('click', submitContact);
      if(modal){
        modal.addEventListener('click', (event) => {
          if(event.target === modal) closeModal();
        });
      }
    });

    document.querySelectorAll('.ct-submit').forEach((btn) => {
      if(btn.dataset.ready === '1') return;
      btn.dataset.ready = '1';
      let timer;
      const fly = () => {
        btn.classList.remove('plane-active');
        void btn.offsetWidth;
        btn.classList.add('plane-active');
        clearTimeout(timer);
        timer = setTimeout(() => btn.classList.remove('plane-active'), 3400);
      };
      btn.addEventListener('mouseenter', fly);
      btn.addEventListener('focus', fly);
    });
  }

  function initAll(){
    initOpening();
    initHero();
    initNav();
    initReveal();
    initFaq();
    initContact();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
  document.addEventListener('astro:page-load', initAll);
})();
