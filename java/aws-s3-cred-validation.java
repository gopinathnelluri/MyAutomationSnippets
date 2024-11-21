import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.Bucket;
import com.amazonaws.SdkClientException;

import java.util.List;

public class S3CredentialTestWithDebug {
    public static void main(String[] args) {
        // Replace with your AWS credentials
        String accessKeyId = "your-access-key-id";
        String secretAccessKey = "your-secret-access-key";
        String sessionToken = "your-session-token"; // Leave null if not using temporary credentials

        System.out.println("Starting the S3 credential validation process...");

        try {
            // Step 1: Create S3 client
            System.out.println("Creating the AmazonS3 client...");
            AmazonS3 s3Client = createS3Client(accessKeyId, secretAccessKey, sessionToken);

            // Step 2: Test the credentials by listing S3 buckets
            System.out.println("Attempting to list S3 buckets...");
            List<Bucket> buckets = s3Client.listBuckets();
            System.out.println("S3 buckets successfully retrieved!");

            // Step 3: Print the bucket names
            if (buckets.isEmpty()) {
                System.out.println("No buckets found in your S3 account.");
            } else {
                System.out.println("Buckets found:");
                for (Bucket bucket : buckets) {
                    System.out.println(" - " + bucket.getName());
                }
            }
        } catch (SdkClientException e) {
            System.err.println("Failed to validate credentials or access S3.");
            System.err.println("Error: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("An unexpected error occurred.");
            System.err.println("Error: " + e.getMessage());
        }

        System.out.println("S3 credential validation process completed.");
    }

    /**
     * Creates an AmazonS3 client using the provided credentials.
     *
     * @param accessKeyId     AWS access key ID
     * @param secretAccessKey AWS secret access key
     * @param sessionToken    AWS session token (optional)
     * @return Configured AmazonS3 client
     */
    private static AmazonS3 createS3Client(String accessKeyId, String secretAccessKey, String sessionToken) {
        System.out.println("Initializing credentials...");
        if (sessionToken != null && !sessionToken.isEmpty()) {
            System.out.println("Using temporary session credentials.");
            // Use temporary session credentials
            BasicSessionCredentials sessionCredentials = new BasicSessionCredentials(
                    accessKeyId, secretAccessKey, sessionToken);
            System.out.println("Session credentials initialized.");
            return AmazonS3ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(sessionCredentials))
                    .build();
        } else {
            System.out.println("Using basic AWS credentials (Access Key and Secret Key).");
            // Use standard credentials
            BasicAWSCredentials basicCredentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
            System.out.println("Basic credentials initialized.");
            return AmazonS3ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(basicCredentials))
                    .build();
        }
    }
}