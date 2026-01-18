import { supabase, isSupabaseConfigured } from './supabaseClient';
import { LabTest, Appointment } from '../types';
import { INITIAL_TESTS } from '../data/initialData';

// Fetch all lab tests
export const getLabTests = async (): Promise<LabTest[]> => {
  // Return local data immediately if Supabase isn't set up
  if (!isSupabaseConfigured()) {
    return INITIAL_TESTS;
  }

  try {
    const { data, error } = await supabase
      .from('lab_tests')
      .select('*')
      .order('name');
    
    if (error) throw error;
    
    // Map DB columns to Frontend types if necessary
    return (data as any[])?.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        description: item.description,
        turnaroundTime: item.turnaround_time
    })) || [];

  } catch (error) {
    console.warn("Failed to fetch tests from Supabase, falling back to local data.", error);
    return INITIAL_TESTS;
  }
};

// Create a new appointment
export const createAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
      console.log("Supabase not configured. Appointment log (simulated):", appointment);
      return true; // Simulate success
  }

  try {
    const { error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_name: appointment.patientName,
          email: appointment.email,
          appointment_date: appointment.date,
          appointment_time: appointment.time,
          test_id: appointment.testId,
          notes: appointment.notes,
          status: 'pending'
        }
      ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error creating appointment:", error);
    return false;
  }
};

// Get Appointments (For Admin)
export const getAppointments = async (): Promise<Appointment[]> => {
    if (!isSupabaseConfigured()) return [];

    try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            patient_name,
            email,
            appointment_date,
            appointment_time,
            notes,
            status,
            created_at,
            lab_tests ( name )
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;

        return (data as any[]).map(item => ({
            id: item.id,
            patientName: item.patient_name,
            email: item.email,
            date: item.appointment_date,
            time: item.appointment_time,
            testId: 'Unknown', 
            testName: item.lab_tests?.name || 'Unknown Test',
            notes: item.notes,
            status: item.status,
            createdAt: new Date(item.created_at).getTime()
        }));

    } catch (e) {
        console.warn("Could not load appointments", e);
        return [];
    }
};

export const updateAppointmentStatus = async (id: string, status: string) => {
    if (!isSupabaseConfigured()) return;
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
    if(error) console.error(error);
};