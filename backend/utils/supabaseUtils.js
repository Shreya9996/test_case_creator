import supabase from "../config/supabaseClient.js";

/**
 * Save generated test cases to database
 */
export const saveTestCase = async (testData, userId = null) => {
  try {
    const { data, error } = await supabase
      .from("test_cases")
      .insert([
        {
          code: testData.code,
          test_type: testData.testType,
          generated_tests: testData.tests,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error saving test case:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Retrieve test cases from database
 */
export const getTestCases = async (userId = null, limit = 10) => {
  try {
    let query = supabase
      .from("test_cases")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error retrieving test cases:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get analytics data
 */
export const getAnalytics = async (userId = null) => {
  try {
    let testQuery = supabase.from("test_cases").select("*");

    if (userId) {
      testQuery = testQuery.eq("user_id", userId);
    }

    const { data: testData, error: testError } = await testQuery;

    if (testError) throw testError;

    const activeSince = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
    const { data: activeData, error: activeError } = await supabase
      .from('test_cases')
      .select('user_id')
      .gte('created_at', activeSince);

    if (activeError) throw activeError;

    const activeSessions = new Set(
      (activeData || [])
        .map((item) => item.user_id)
        .filter((id) => id)
    ).size;

    return {
      success: true,
      data: {
        totalTestCases: testData?.length || 0,
        activeSessions: activeSessions || 0,
        recentTests: testData?.slice(0, 5) || []
      }
    };
  } catch (error) {
    console.error("Error getting analytics:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Save chat history
 */
export const saveChatMessage = async (messageData, userId = null) => {
  try {
    const { data, error } = await supabase
      .from("chat_history")
      .insert([
        {
          message: messageData.message,
          response: messageData.response,
          code_context: messageData.codeContext || null,
          user_id: userId,
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error saving chat message:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get chat history
 */
export const getChatHistory = async (userId = null, limit = 20) => {
  try {
    let query = supabase
      .from("chat_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error("Error retrieving chat history:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get registered users from Supabase Auth (service role required)
 */
export const getUsers = async () => {
  try {
    // Check if we have service role access (only admin can list users)
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("SUPABASE_SERVICE_ROLE_KEY not found. Admin features disabled.");
      return { success: false, error: "Admin access not configured" };
    }
    
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    return { success: true, data: data?.users || [] };
  } catch (error) {
    console.error("Error retrieving users:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a test case by ID
 */
export const deleteTestCase = async (testCaseId, userId = null) => {
  try {
    let query = supabase.from('test_cases').delete().eq('id', testCaseId);
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error deleting test case:', error);
    return { success: false, error: error.message };
  }
};

export default {
  saveTestCase,
  getTestCases,
  getAnalytics,
  saveChatMessage,
  getChatHistory,
  getUsers,
  deleteTestCase
};
