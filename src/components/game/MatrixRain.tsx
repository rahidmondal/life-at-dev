'use client';

import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  isMobile?: boolean;
}

export function MatrixRain({ isMobile = false }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const katakana =
      '가나다라마바사아자차카타파하한글' + // Korean Hangul
      '天地玄黄宇宙洪荒日月盈昃辰宿列张' + // Classical Chinese
      '一二三四五六七八九十百千萬' + // Chinese numerals
      'アイウエオカキクケコサシスセソ' + // Japanese Katakana
      'あいうえおかきくけこさしすせそ' + // Japanese Hiragana
      'กขฃคฅฆงจฉชซฌญฎฏฐฑฒณด' + // Thai
      'अआइईउऊऋएऐओऔकखगघङचछजझञ' + // Devanagari (Sanskrit/Hindi)
      'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ' + // Greek uppercase
      'αβγδεζηθικλμνξοπρστυφχψω' + // Greek lowercase
      'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ' + // Latin extended
      'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'; // Cyrillic

    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const chars = katakana + latin;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const fontSize = 12;
    const columns = Math.floor(width / fontSize);
    const dropDensity = isMobile ? 0.3 : 0.6;
    const activeColumns = Math.floor(columns * dropDensity);

    const drops: number[] = [];
    for (let i = 0; i < activeColumns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0F0';
      ctx.font = `${String(fontSize)}px monospace`;

      for (let i = 0; i < activeColumns; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = (i / dropDensity) * fontSize;
        const y = drops[i] * fontSize;

        ctx.shadowBlur = 8;
        ctx.shadowColor = '#10B981';
        ctx.fillStyle = '#10B981';
        ctx.fillText(char, x, y);

        ctx.shadowBlur = 0;

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" style={{ opacity: 0.25 }} />;
}
