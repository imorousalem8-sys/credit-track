"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ModalReceipt() {
  const { activeReceipt, setActiveReceipt, formatAmount } = useApp();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  useEffect(() => {
    if (activeReceipt && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "#1E293B";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
      }
      setHasSigned(false);
    }
  }, [activeReceipt]);

  if (!activeReceipt) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasSigned(true);
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
    }
    setHasSigned(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay active" style={{ display: 'flex' }}>
      <div className="modal-card" style={{ maxWidth: '460px', padding: '24px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck className="text-emerald-500" size={22} />
            <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0F172A' }}>Reçu de Règlement Électronique</span>
          </div>
          <button 
            type="button" 
            onClick={() => setActiveReceipt(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Ticket Content */}
        <div id="receipt-print-area" style={{
          background: '#FFFFFF',
          color: '#0F172A',
          padding: '20px',
          borderRadius: '12px',
          border: '1.5px dashed #CBD5E1',
          fontFamily: 'monospace',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>CREDITTRACK PRO</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '2px 0' }}>Reçu Officiel de Recouvrement</p>
            <span style={{ fontSize: '0.7rem', background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
              Réf: {activeReceipt.ref}
            </span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px dashed #CBD5E1', margin: '12px 0' }} />

          <div style={{ fontSize: '0.84rem', lineHeight: '1.7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Client :</span>
              <strong style={{ color: '#0F172A' }}>{activeReceipt.clientName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Téléphone :</span>
              <span>{activeReceipt.clientPhone || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Date :</span>
              <span>{activeReceipt.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Règlement :</span>
              <span style={{ fontWeight: 700, color: '#10B981' }}>{activeReceipt.method}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Objet :</span>
              <span>{activeReceipt.itemsDesc}</span>
            </div>
          </div>

          <div style={{
            background: '#F8FAFC',
            padding: '12px',
            borderRadius: '8px',
            textAlign: 'center',
            margin: '14px 0',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Montant Total Réglé</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>
              {formatAmount(activeReceipt.amount)}
            </div>
          </div>

          {/* Signature Canvas */}
          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>Signature du Client :</span>
              <button 
                type="button" 
                onClick={clearSignature}
                style={{ fontSize: '0.68rem', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Effacer
              </button>
            </div>
            <canvas
              ref={canvasRef}
              width={340}
              height={80}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              style={{
                background: '#F8FAFC',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                width: '100%',
                cursor: 'crosshair'
              }}
            />
            {!hasSigned && (
              <p style={{ fontSize: '0.68rem', color: '#94A3B8', margin: '4px 0 0 0', fontStyle: 'italic' }}>
                (Signez avec le doigt ou la souris ci-dessus)
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button 
            type="button" 
            className="btn btn-outline" 
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={handlePrint}
          >
            <Printer size={16} /> Imprimer
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            style={{ flex: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#10B981' }}
            onClick={() => {
              handlePrint();
              setActiveReceipt(null);
            }}
          >
            <CheckCircle size={16} /> Valider & Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
