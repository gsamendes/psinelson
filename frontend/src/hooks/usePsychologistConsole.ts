import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  acceptAppointment,
  listPsychologistAppointments,
  rejectAppointment,
} from '../services/appointmentService';
import {
  addSlot,
  listSlots,
  removeSlot,
  updateSlot,
  type SlotInput,
} from '../services/availabilityService';
import { listNotifications, markAllRead } from '../services/notificationService';

const APPTS = ['psy-appointments'];
const SLOTS = ['psy-slots'];
const NOTIFS = (audience: string) => ['notifications', audience];

/* ----------------------------- Consultas ----------------------------- */

/** Consultas do psicólogo (solicitações + agenda). */
export function usePsychologistAppointments() {
  return useQuery({ queryKey: APPTS, queryFn: listPsychologistAppointments });
}

function useAppointmentDecision(fn: (id: string) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fn(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: APPTS });
      qc.invalidateQueries({ queryKey: ['appointments'] }); // visão do paciente
      qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/** Aceita solicitação → CONFIRMADA. */
export function useAcceptAppointment() {
  return useAppointmentDecision(acceptAppointment);
}

/** Recusa solicitação → RECUSADA. */
export function useRejectAppointment() {
  return useAppointmentDecision(rejectAppointment);
}

/* -------------------------- Disponibilidade --------------------------- */

export function useSlots() {
  return useQuery({ queryKey: SLOTS, queryFn: listSlots });
}

export function useAddSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SlotInput) => addSlot(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: SLOTS }),
  });
}

export function useUpdateSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; input: SlotInput }) =>
      updateSlot(vars.id, vars.input),
    onSuccess: () => qc.invalidateQueries({ queryKey: SLOTS }),
  });
}

export function useRemoveSlot() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeSlot(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SLOTS }),
  });
}

/* --------------------------- Notificações ----------------------------- */

/** Notificações internas simuladas de um público ('psychologist' | 'patient'). */
export function useNotifications(audience: 'psychologist' | 'patient') {
  return useQuery({
    queryKey: NOTIFS(audience),
    queryFn: () => listNotifications(audience),
  });
}

export function useMarkNotificationsRead(audience: 'psychologist' | 'patient') {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllRead(audience),
    onSuccess: () => qc.invalidateQueries({ queryKey: NOTIFS(audience) }),
  });
}
