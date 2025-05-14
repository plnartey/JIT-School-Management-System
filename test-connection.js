// Test script to verify Supabase connection and data operations
document.addEventListener('DOMContentLoaded', function() {
    // Add a test button to the page
    const testButton = document.createElement('button');
    testButton.id = 'test-supabase-btn';
    testButton.className = 'btn btn-warning position-fixed bottom-0 end-0 m-3';
    testButton.innerHTML = '<i class="bi bi-lightning"></i> Test Supabase Connection';
    document.body.appendChild(testButton);
    
    // Add event listener to the test button
    testButton.addEventListener('click', testSupabaseConnection);
    
    async function testSupabaseConnection() {
        console.log('Testing Supabase connection...');
        try {
            // Show spinner
            app.showSpinner();
            app.showToast('Testing Supabase connection...', 'info');
            
            // Test 1: Verify Supabase client exists
            if (!app.supabase) {
                throw new Error('Supabase client is not initialized');
            }
            console.log('Test 1 passed: Supabase client exists');
            
            // Test 2: Try to query the database
            const { data: testData, error: testError } = await app.supabase
                .from('programs')
                .select('*')
                .limit(1);
                
            if (testError) {
                throw new Error('Failed to query database: ' + testError.message);
            }
            
            console.log('Test 2 passed: Database query successful', testData);
            
            // Test 3: Try to insert a test record
            const testProgram = {
                code: 'TEST' + Date.now(),
                name: 'Test Program ' + new Date().toISOString(),
                description: 'This is a test program created to verify database connectivity',
                duration: 12
            };
            
            const { data: insertData, error: insertError } = await app.supabase
                .from('programs')
                .insert(testProgram)
                .select();
                
            if (insertError) {
                throw new Error('Failed to insert test record: ' + insertError.message);
            }
            
            console.log('Test 3 passed: Record insertion successful', insertData);
            
            // Test 4: Try to delete the test record
            const { error: deleteError } = await app.supabase
                .from('programs')
                .delete()
                .eq('code', testProgram.code);
                
            if (deleteError) {
                throw new Error('Failed to delete test record: ' + deleteError.message);
            }
            
            console.log('Test 4 passed: Record deletion successful');
            
            // All tests passed
            app.showToast('Supabase connection tests passed! Check console for details.', 'success');
        } catch (error) {
            console.error('Supabase connection test failed:', error);
            app.showToast('Connection test failed: ' + error.message, 'danger');
        } finally {
            app.hideSpinner();
        }
    }
});
