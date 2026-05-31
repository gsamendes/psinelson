import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelAppointment,
  createAppointmentRequest,
  listAppointments,
  type CreateAppointmentInput,
} from '../services/appointmentService';

const KEY = ['appointments'];

/** Lista as consultas do paciente. */
export function useAppointments() {
  return useQuery({ queryKey: KEY, queryFn: listAppointments });
}

/** Solicita uma consulta (status PENDENTE). Invalida a lista ao concluir. */
export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAppointmentInput) =>
      createAppointmentRequest(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

/** Cancela uma consulta. Invalida a lista ao concluir. */
export function useCancelAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelAppointment(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}
